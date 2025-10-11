/**
 * MedicationAutocomplete Component
 *
 * A comprehensive medication search component that integrates with Health Canada's Drug Product Database API.
 * Supports searching by brand name, DIN (Drug Identification Number), or active ingredient.
 * Also includes a custom drug entry mode for medications not in the database.
 */

"use client";
import { useState } from "react";
import {
  TextField,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  Paper,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Button,
} from "@mui/material";

// Type definitions for Health Canada API responses

/** Drug product information from the drugproduct API endpoint */
interface DrugProduct {
  drug_code: number;
  brand_name: string;
  company_name: string;
  drug_identification_number?: string;
}

/** Active ingredient information from the activeingredient API endpoint */
interface ActiveIngredient {
  drug_code: number;
  ingredient_name: string;
  strength: string;
  strength_unit: string;
  dosage_unit: string;
  dosage_value: string;
}

/** Dosage form information from the form API endpoint */
interface DosageForm {
  drug_code: number;
  pharmaceutical_form_code: number;
  pharmaceutical_form_name: string;
}

/** Combined medication data structure used throughout the component */
interface MedicationOption {
  brandName: string;
  strength: string;
  dosageForm: string;
  drugCode: number;
  companyName: string;
  din: string;
  activeIngredient: string;
}

/** Component props */
interface MedicationAutocompleteProps {
  /** Callback when a medication is selected (either from API or custom entry) */
  onSelect: (medication: MedicationOption) => void;
  /** Optional callback when custom mode is toggled */
  onCustomModeChange?: (isCustom: boolean) => void;
}

/** Available search types for the API */
type SearchType = "brand" | "din" | "ingredient";

export default function MedicationAutocomplete({
  onSelect,
  onCustomModeChange,
}: MedicationAutocompleteProps) {
  // API Search State
  const [searchType, setSearchType] = useState<SearchType>("brand"); // Type of search: brand name, DIN, or ingredient
  const [searchTerm, setSearchTerm] = useState(""); // User's search query
  const [strengthFilter, setStrengthFilter] = useState(""); // Optional filter for medication strength (e.g., "500")
  const [dosageFormFilter, setDosageFormFilter] = useState(""); // Optional filter for dosage form (e.g., "Tablet")
  const [availableDosageForms, setAvailableDosageForms] = useState<string[]>(
    [],
  ); // Unique dosage forms from search results
  const [suggestions, setSuggestions] = useState<MedicationOption[]>([]); // All search results from API
  const [filteredSuggestions, setFilteredSuggestions] = useState<
    MedicationOption[]
  >([]); // Filtered results after applying strength/form filters
  const [selectedDrug, setSelectedDrug] = useState<MedicationOption | null>(
    null,
  ); // Currently selected medication
  const [loading, setLoading] = useState(false); // Loading state during API calls

  // Custom Entry State
  const [customMode, setCustomMode] = useState(false); // Toggle between API search and custom entry
  const [customDrugName, setCustomDrugName] = useState(""); // Custom drug name input
  const [customDose, setCustomDose] = useState(""); // Custom dose input

  /**
   * Searches for medications using the Health Canada Drug Product Database API
   * Handles three search types: brand name, DIN, and active ingredient
   * Fetches additional data (ingredients and dosage forms) for each result
   */
  const searchMedications = async () => {
    // Require at least 2 characters to search
    if (!searchTerm || searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const drugCodes = new Set<number>(); // Store unique drug codes
      const drugMap = new Map<number, DrugProduct>(); // Map drug codes to drug products

      // SEARCH BY ACTIVE INGREDIENT
      if (searchType === "ingredient") {
        // Use the ingredientname parameter to search by active ingredient
        const ingredients: ActiveIngredient[] = await fetch(
          `https://health-products.canada.ca/api/drug/activeingredient/?lang=en&type=json&ingredientname=${encodeURIComponent(searchTerm)}`,
        ).then((r) => r.json());

        if (!ingredients || ingredients.length === 0) {
          setSuggestions([]);
          setLoading(false);
          return;
        }

        // Collect unique drug codes from matching ingredients
        ingredients.forEach((ing) => drugCodes.add(ing.drug_code));

        // Fetch all drug products to get brand names and company info
        const allDrugs: DrugProduct[] = await fetch(
          `https://health-products.canada.ca/api/drug/drugproduct/?lang=en&type=json`,
        ).then((r) => r.json());

        // Map drug codes to their product information
        drugCodes.forEach((code) => {
          const drug = allDrugs.find((d) => d.drug_code === code);
          if (drug) {
            drugMap.set(code, drug);
          }
        });
      } else {
        // SEARCH BY BRAND NAME OR DIN
        // Fetch all drug products from the API
        const allDrugs: DrugProduct[] = await fetch(
          `https://health-products.canada.ca/api/drug/drugproduct/?lang=en&type=json`,
        ).then((r) => r.json());

        if (searchType === "brand") {
          // Filter by brand name (case-insensitive partial match)
          allDrugs
            .filter((drug: DrugProduct) =>
              drug.brand_name.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            .forEach((drug: DrugProduct) => {
              drugCodes.add(drug.drug_code);
              drugMap.set(drug.drug_code, drug);
            });
        } else if (searchType === "din") {
          // Filter by DIN (exact match)
          allDrugs
            .filter((drug: DrugProduct) =>
              drug.drug_identification_number?.includes(searchTerm),
            )
            .forEach((drug: DrugProduct) => {
              drugCodes.add(drug.drug_code);
              drugMap.set(drug.drug_code, drug);
            });
        }
      }

      // No results found
      if (drugCodes.size === 0) {
        setSuggestions([]);
        setLoading(false);
        return;
      }

      // FETCH ADDITIONAL DATA FOR EACH DRUG
      // For each drug code, fetch active ingredients and dosage forms
      // Limit to 100 results to avoid overwhelming the API
      const medicationPromises = Array.from(drugCodes)
        .slice(0, 100)
        .map(async (drugCode) => {
          const drug = drugMap.get(drugCode);
          if (!drug) return null;

          try {
            // Fetch both active ingredients and dosage forms in parallel
            const [ingredients, forms]: [ActiveIngredient[], DosageForm[]] =
              await Promise.all([
                fetch(
                  `https://health-products.canada.ca/api/drug/activeingredient/?lang=en&type=json&id=${drugCode}`,
                ).then((r) => r.json()),
                fetch(
                  `https://health-products.canada.ca/api/drug/form/?lang=en&type=json&id=${drugCode}`,
                ).then((r) => r.json()),
              ]);

            if (ingredients && ingredients.length > 0) {
              const ingredient = ingredients[0]; // Use first ingredient
              // Combine strength and unit (e.g., "500MG")
              const strength = ingredient.strength
                ? `${ingredient.strength}${ingredient.strength_unit || ""}`
                : "";
              // Get pharmaceutical form name (e.g., "Tablet", "Capsule")
              const dosageForm =
                forms && forms.length > 0
                  ? forms[0].pharmaceutical_form_name
                  : "";

              // Return combined medication data
              return {
                brandName: drug.brand_name,
                strength,
                dosageForm,
                drugCode: drug.drug_code,
                companyName: drug.company_name,
                din: drug.drug_identification_number || "",
                activeIngredient: ingredient.ingredient_name || "",
              };
            }
            return null;
          } catch (error) {
            console.error(`Error fetching drug ${drugCode}:`, error);
            return null;
          }
        });

      // Wait for all medication data to be fetched
      const medications = await Promise.all(medicationPromises);
      // Filter out any null results
      const validMedications = medications.filter(
        (med): med is MedicationOption => med !== null,
      );

      // Extract unique dosage forms from results
      const uniqueForms = Array.from(
        new Set(
          validMedications
            .map((med) => med.dosageForm)
            .filter((form) => form !== ""),
        ),
      ).sort();
      setAvailableDosageForms(uniqueForms);

      setSuggestions(validMedications);
      applyFilters(validMedications); // Apply any active filters
    } catch (error) {
      console.error("Error searching medications:", error);
      setSuggestions([]);
      setFilteredSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Applies strength and dosage form filters to the medication suggestions
   * Filters are case-insensitive exact matches
   */
  const applyFilters = (meds: MedicationOption[] = suggestions) => {
    let filtered = meds;

    // Filter by strength (e.g., "500" matches "500MG")
    if (strengthFilter) {
      filtered = filtered.filter((med) =>
        med.strength.toLowerCase().includes(strengthFilter.toLowerCase()),
      );
    }

    // Filter by dosage form (exact match)
    if (dosageFormFilter) {
      filtered = filtered.filter((med) => med.dosageForm === dosageFormFilter);
    }

    setFilteredSuggestions(filtered);
  };

  /**
   * Handles medication selection from the search results
   * Updates the selected drug and notifies parent component
   */
  const handleSelect = (med: MedicationOption) => {
    setSelectedDrug(med);
    onSelect(med);
  };

  /**
   * Toggles between API search mode and custom drug entry mode
   * Clears relevant state when switching modes
   */
  const handleCustomModeChange = (checked: boolean) => {
    setCustomMode(checked);
    onCustomModeChange?.(checked); // Notify parent component
    if (checked) {
      // Clear API search results when entering custom mode
      setSuggestions([]);
      setFilteredSuggestions([]);
      setSelectedDrug(null);
      setSearchTerm("");
    } else {
      // Clear custom fields when exiting custom mode
      setCustomDrugName("");
      setCustomDose("");
    }
  };

  /**
   * Creates a custom medication entry from user input
   * Triggered when the dose field loses focus
   */
  const handleCustomDrugSubmit = () => {
    if (customDrugName) {
      const customMed: MedicationOption = {
        brandName: customDrugName,
        strength: customDose,
        dosageForm: "",
        drugCode: 0, // No drug code for custom entries
        companyName: "Custom Entry",
        din: "",
        activeIngredient: "",
      };
      setSelectedDrug(customMed);
      onSelect(customMed);
    }
  };

  /**
   * Resets all search and filter states
   * Clears selected drug and search results
   */
  const handleReset = () => {
    setSearchTerm("");
    setStrengthFilter("");
    setDosageFormFilter("");
    setSuggestions([]);
    setFilteredSuggestions([]);
    setAvailableDosageForms([]);
    setSelectedDrug(null);
    setCustomDrugName("");
    setCustomDose("");
  };

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 3 }}>
      {/* LEFT COLUMN: Search/Custom Entry Interface */}
      <Box>
        {/* Toggle between API search and custom entry */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={customMode}
                onChange={(e) => handleCustomModeChange(e.target.checked)}
              />
            }
            label="Custom Drug Entry"
          />
          <Button
            variant="outlined"
            size="small"
            onClick={handleReset}
            sx={{ ml: 2 }}
          >
            Reset
          </Button>
        </Box>

        {customMode ? (
          /* CUSTOM DRUG ENTRY MODE */
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Drug Name"
              variant="outlined"
              size="small"
              fullWidth
              value={customDrugName}
              onChange={(e) => setCustomDrugName(e.target.value)}
              placeholder="Enter custom drug name"
            />
            <TextField
              label="Dose"
              variant="outlined"
              size="small"
              fullWidth
              value={customDose}
              onChange={(e) => setCustomDose(e.target.value)}
              onBlur={handleCustomDrugSubmit}
              placeholder="e.g., 500mg"
            />
          </Box>
        ) : (
          /* API SEARCH MODE */
          <>
            {/* Search type selector and search input */}
            <Box sx={{ display: "flex", gap: 1.5, mb: 2 }}>
              <FormControl
                variant="outlined"
                size="small"
                sx={{ minWidth: 160 }}
              >
                <InputLabel>Search By</InputLabel>
                <Select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value as SearchType)}
                  label="Search By"
                >
                  <MenuItem value="brand">Brand Name</MenuItem>
                  <MenuItem value="din">DIN</MenuItem>
                  <MenuItem value="ingredient">Active Ingredient</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Search Medication"
                variant="outlined"
                size="small"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyUp={searchMedications}
                placeholder={
                  searchType === "brand"
                    ? "e.g., Tylenol"
                    : searchType === "din"
                      ? "e.g., 00000019"
                      : "e.g., amoxicillin"
                }
              />
            </Box>

            {/* Filter controls (only shown when there are results) */}
            {suggestions.length > 0 && (
              <Box sx={{ display: "flex", gap: 1.5, mb: 2 }}>
                <TextField
                  label="Filter by Strength"
                  variant="outlined"
                  size="small"
                  value={strengthFilter}
                  onChange={(e) => {
                    setStrengthFilter(e.target.value);
                    applyFilters();
                  }}
                  placeholder="e.g., 500"
                  sx={{ flex: 1 }}
                />
                <FormControl variant="outlined" size="small" sx={{ flex: 1 }}>
                  <InputLabel>Filter by Dosage Form</InputLabel>
                  <Select
                    value={dosageFormFilter}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setDosageFormFilter(newValue);
                      // Need to use suggestions directly since state hasn't updated yet
                      let filtered = suggestions;

                      if (strengthFilter) {
                        filtered = filtered.filter((med) =>
                          med.strength
                            .toLowerCase()
                            .includes(strengthFilter.toLowerCase()),
                        );
                      }

                      if (newValue) {
                        filtered = filtered.filter(
                          (med) => med.dosageForm === newValue,
                        );
                      }

                      setFilteredSuggestions(filtered);
                    }}
                    label="Filter by Dosage Form"
                  >
                    <MenuItem value="">All Forms</MenuItem>
                    {availableDosageForms.map((form) => (
                      <MenuItem key={form} value={form}>
                        {form}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}

            {/* Search results panel */}
            {(loading ||
              filteredSuggestions.length > 0 ||
              searchTerm.length >= 2) && (
              <Paper
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  maxHeight: 400,
                  overflow: "auto",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                {loading ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      py: 6,
                    }}
                  >
                    <CircularProgress size={32} />
                  </Box>
                ) : filteredSuggestions.length > 0 ? (
                  <List disablePadding>
                    {filteredSuggestions.map((med, index) => (
                      <ListItem
                        key={med.drugCode}
                        disablePadding
                        divider={index < filteredSuggestions.length - 1}
                      >
                        <ListItemButton
                          onClick={() => handleSelect(med)}
                          sx={{
                            py: 1.5,
                            px: 2,
                            "&:hover": {
                              backgroundColor: "action.hover",
                            },
                          }}
                        >
                          <Box sx={{ width: "100%" }}>
                            <Typography variant="subtitle1" fontWeight="600">
                              {med.brandName}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="primary"
                              sx={{ mt: 0.5 }}
                            >
                              {med.strength} {med.dosageForm}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 0.5 }}
                            >
                              {med.activeIngredient}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ mt: 0.5, display: "block" }}
                            >
                              {med.companyName}
                            </Typography>
                          </Box>
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ py: 6, textAlign: "center" }}>
                    <Typography color="text.secondary">
                      {suggestions.length > 0
                        ? "No medications match your filters"
                        : "No medications found"}
                    </Typography>
                  </Box>
                )}
              </Paper>
            )}
          </>
        )}
      </Box>

      {/* RIGHT COLUMN: Selected Medication Display */}
      <Box>
        {selectedDrug ? (
          /* Show selected medication details with gradient background */
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              position: "sticky",
              top: 16,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            }}
          >
            <Typography
              variant="overline"
              sx={{
                opacity: 0.9,
                letterSpacing: 1,
                fontWeight: 600,
                display: "block",
                mb: 2,
              }}
            >
              Selected Medication
            </Typography>
            <Typography variant="h5" fontWeight="700" sx={{ mb: 2 }}>
              {selectedDrug.brandName}
            </Typography>
            <Box
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                borderRadius: 1.5,
                p: 2,
                mb: 2,
              }}
            >
              <Typography variant="h6" fontWeight="600">
                {selectedDrug.strength}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {selectedDrug.dosageForm}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="caption"
                sx={{ opacity: 0.8, display: "block", mb: 0.5 }}
              >
                Active Ingredient
              </Typography>
              <Typography variant="body2" fontWeight="500">
                {selectedDrug.activeIngredient}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="caption"
                sx={{ opacity: 0.8, display: "block", mb: 0.5 }}
              >
                Manufacturer
              </Typography>
              <Typography variant="body2" fontWeight="500">
                {selectedDrug.companyName}
              </Typography>
            </Box>
            <Box
              sx={{
                pt: 2,
                borderTop: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                DIN: {selectedDrug.din}
              </Typography>
            </Box>
          </Paper>
        ) : (
          /* Show placeholder when no medication is selected */
          <Paper
            variant="outlined"
            sx={{
              p: 4,
              borderRadius: 2,
              textAlign: "center",
              borderStyle: "dashed",
              backgroundColor: "grey.50",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Select a medication to see details
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
}
