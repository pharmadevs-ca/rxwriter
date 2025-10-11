# Medication Search Components - Technical Summary

## Overview

This document explains how the `MedicationAutocomplete` and `PrescriptionInputs` components work together to provide medication search and prescription form functionality using the Health Canada Drug Product Database API.

## Component Architecture

### 1. PrescriptionInputs (Parent Component)

**Purpose:** Main prescription form that collects all prescription information.

**Key Features:**

- Integrates the medication search component
- Manages prescription data state
- Conditionally shows/hides the dose field based on entry mode
- Collects standard prescription fields (sig, mitte, refills, pharmacist info)

**State Management:**

```javascript
const [isCustomMode, setIsCustomMode] = React.useState(false);
```

- Tracks whether user is in custom drug entry mode
- When `true`: Shows dose field for manual entry
- When `false`: Dose comes from selected medication (shown in the purple card)

**Data Flow:**

1. User selects medication → `handleMedicationSelect()` called
2. Updates `prescriptionData` with: `brandName`, `strength`, `dosageForm`
3. Parent component receives updated prescription data

---

### 2. MedicationAutocomplete (Search Component)

**Purpose:** Provides medication search via Health Canada API with two modes:

- **API Search Mode:** Search by brand name, DIN, or active ingredient
- **Custom Entry Mode:** Manual drug name and dose entry

## API Integration - How It Works

### Search Flow Diagram

```
User Types Search Term (min 2 chars)
         ↓
   searchMedications()
         ↓
    ┌────┴────┐
    │         │
Brand/DIN   Ingredient
  Search     Search
    │         │
    └────┬────┘
         ↓
  Collect Drug Codes
         ↓
  Fetch Additional Data
  (Ingredients + Forms)
         ↓
   Display Results
```

### Detailed API Call Process

#### Step 1: Initial Search

**Search by Brand Name or DIN:**

```javascript
// Fetch ALL drug products
GET https://health-products.canada.ca/api/drug/drugproduct/?lang=en&type=json

// Filter locally by brand name (case-insensitive)
allDrugs.filter(drug =>
  drug.brand_name.toLowerCase().includes(searchTerm.toLowerCase())
)

// OR filter by DIN
allDrugs.filter(drug =>
  drug.drug_identification_number?.includes(searchTerm)
)
```

**Search by Active Ingredient:**

```javascript
// Use ingredientname parameter for targeted search
GET https://health-products.canada.ca/api/drug/activeingredient/
    ?lang=en
    &type=json
    &ingredientname=amoxicillin

// Returns: Array of ingredients with drug_code
// Then fetch drug products for those codes
```

#### Step 2: Collect Drug Codes

```javascript
const drugCodes = new Set<number>();  // Unique drug codes
const drugMap = new Map<number, DrugProduct>();  // Code → Drug mapping

// Store each matching drug
drugCodes.add(drug.drug_code);
drugMap.set(drug.drug_code, drug);
```

#### Step 3: Fetch Additional Data (Parallel Requests)

For each drug code (limited to 20 results), make **two parallel API calls**:

```javascript
const [ingredients, forms] = await Promise.all([
  // Call 1: Get active ingredients
  fetch(`https://health-products.canada.ca/api/drug/activeingredient/
         ?lang=en&type=json&id=${drugCode}`),

  // Call 2: Get dosage forms
  fetch(`https://health-products.canada.ca/api/drug/form/
         ?lang=en&type=json&id=${drugCode}`),
]);
```

**Why two calls?**

- The `activeingredient` API returns strength but NOT dosage form
- The `form` API returns pharmaceutical form names (Tablet, Capsule, etc.)
- We need both to display complete medication information

#### Step 4: Transform Data

```javascript
// Combine data from all three API calls
{
  brandName: drug.brand_name,              // From drugproduct API
  strength: "500MG",                       // From activeingredient API
  dosageForm: "Tablet",                    // From form API
  drugCode: drug.drug_code,
  companyName: drug.company_name,          // From drugproduct API
  din: drug.drug_identification_number,    // From drugproduct API
  activeIngredient: ingredient.ingredient_name  // From activeingredient API
}
```

#### Step 5: Display Results

Results are shown in a scrollable list with:

- Brand name (bold)
- Strength + Dosage form (blue text)
- Active ingredient (gray text)
- Company name (small gray text)

### API Response Examples

**Drug Product Response:**

```json
{
  "drug_code": 2177,
  "brand_name": "AMOXICILLIN",
  "company_name": "APOTEX INC",
  "drug_identification_number": "02243051"
}
```

**Active Ingredient Response:**

```json
{
  "drug_code": 2177,
  "ingredient_name": "AMOXICILLIN",
  "strength": "500",
  "strength_unit": "MG",
  "dosage_unit": "CAP"
}
```

**Dosage Form Response:**

```json
{
  "drug_code": 2177,
  "pharmaceutical_form_code": 18,
  "pharmaceutical_form_name": "Capsule"
}
```

## Filtering System

After initial search results are loaded, users can filter by:

### Strength Filter

- Text input for partial matching
- Example: "500" matches "500MG", "500MCG"
- Case-insensitive

### Dosage Form Filter

- Dropdown with common forms
- Options: Tablet, Capsule, Solution, Suspension, Injection, Cream, Ointment, Powder, Syrup, Drops
- Exact match on pharmaceutical form name

**Filter Application:**

```javascript
// Filters are applied client-side after API results are loaded
let filtered = suggestions;

if (strengthFilter) {
  filtered = filtered.filter((med) =>
    med.strength.toLowerCase().includes(strengthFilter.toLowerCase()),
  );
}

if (dosageFormFilter) {
  filtered = filtered.filter((med) =>
    med.dosageForm.toLowerCase().includes(dosageFormFilter.toLowerCase()),
  );
}
```

## Custom Drug Entry Mode

When the "Custom Drug Entry" checkbox is checked:

1. **UI Changes:**
   - Hides API search interface
   - Shows two simple text fields: Drug Name and Dose
   - Dose field in parent form becomes visible

2. **Data Creation:**
   - When dose field loses focus (`onBlur`), creates a custom medication object
   - Sets `drugCode: 0` and `companyName: "Custom Entry"`
   - No API calls are made

3. **Use Case:**
   - Medications not in Health Canada database
   - Compounded medications
   - Quick manual entry

## Selected Medication Display

The purple gradient card on the right shows:

**When medication is selected:**

- Brand name (large, bold)
- Strength + Dosage form (in semi-transparent box)
- Active ingredient (labeled section)
- Manufacturer (labeled section)
- DIN (at bottom)

**When nothing is selected:**

- Dashed border placeholder
- "Select a medication to see details" message

**Styling:**

- Sticky positioning (stays visible while scrolling)
- Gradient background: `#667eea` → `#764ba2`
- White text with opacity variations for hierarchy

## Performance Considerations

1. **Search Debouncing:** Not currently implemented, but could be added to reduce API calls

2. **Result Limiting:** Only first 20 results are processed to avoid:
   - Overwhelming the API with requests
   - Long loading times
   - UI performance issues

3. **Parallel Requests:** Using `Promise.all()` to fetch ingredients and forms simultaneously

4. **Client-Side Filtering:** Filters are applied to already-loaded results (no additional API calls)

## Error Handling

- Individual drug fetch errors are caught and logged
- Failed drugs return `null` and are filtered out
- Empty results show appropriate messages
- Minimum 2 characters required to search

## State Management Summary

**MedicationAutocomplete State:**

- `searchType`: "brand" | "din" | "ingredient"
- `searchTerm`: User's search query
- `suggestions`: All API results
- `filteredSuggestions`: After applying filters
- `selectedDrug`: Currently selected medication
- `loading`: API call in progress
- `customMode`: Toggle between API and custom entry
- `strengthFilter`, `dosageFormFilter`: Filter values

**PrescriptionInputs State:**

- `prescriptionData`: All form field values
- `isCustomMode`: Mirrors custom mode from child component

## Component Communication

```
PrescriptionInputs (Parent)
    ↓ props: onSelect, onCustomModeChange
MedicationAutocomplete (Child)
    ↓ callback: onSelect(medication)
PrescriptionInputs
    ↓ updates: prescriptionData
```

## Quick Reference: API Endpoints

| Endpoint                  | Purpose               | Parameters              |
| ------------------------- | --------------------- | ----------------------- |
| `/drug/drugproduct/`      | Get all drug products | `lang=en&type=json`     |
| `/drug/activeingredient/` | Search by ingredient  | `ingredientname=<term>` |
| `/drug/activeingredient/` | Get drug ingredients  | `id=<drug_code>`        |
| `/drug/form/`             | Get dosage forms      | `id=<drug_code>`        |

All endpoints: `https://health-products.canada.ca/api/`

Documentation: https://health-products.canada.ca/api/documentation/dpd-documentation-en.html
