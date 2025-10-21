"use client";
import React, { useState } from "react";
import { TextField } from "@mui/material";
import MedicationAutocomplete from "./medication-autocomplete";
import { PrescriptionData, PharmacistData } from "../types/prescription";

interface PrescriptionInputsProps {
  prescriptionData: PrescriptionData;
  setPrescriptionData: (data: PrescriptionData) => void;
  setPharmacistData: (data: PharmacistData) => void;
  pharmacistData: PharmacistData;
}

export default function PrescriptionInputs({
  prescriptionData,
  setPrescriptionData,
  setPharmacistData,
  pharmacistData,
}: PrescriptionInputsProps) {
  const handleChange = (e) => {
    setPrescriptionData({ ...prescriptionData, [e.target.id]: e.target.value });
  };
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  const handleMedicationSelect = (medication) => {
    setPrescriptionData({
      ...prescriptionData,
      medicationName: medication.brandName,
      dose: medication.strength,
      dosageForm: medication.dosageForm,
    });
    const handlePrescriptionChange = (
      e: React.ChangeEvent<HTMLInputElement>,
    ) => {
      setPrescriptionData({
        ...prescriptionData,
        [e.target.id]: e.target.value,
      });
    };

    const handlePharmacistChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPharmacistData({ ...pharmacistData, [e.target.id]: e.target.value });
    };

    return (
      <div className="flex flex-col gap-4">
        {/* Medication search/selection component */}
        <MedicationAutocomplete
          onSelect={handleMedicationSelect}
          onCustomModeChange={setIsCustomMode}
        />

        {/* Dose field - only shown in custom drug entry mode
          In API mode, dose is already displayed in the selected medication card */}
        {isCustomMode && (
          <TextField
            id="dose"
            label="Dose"
            variant="outlined"
            value={prescriptionData?.dose || ""}
            onChange={handleChange}
          />
        )}

        {/* Sig (Signatura) - dosing instructions for the patient */}
        <TextField
          id="medicationName"
          label="Medication Name"
          variant="outlined"
          value={prescriptionData.medicationName || ""}
          onChange={handlePrescriptionChange}
        />

        <TextField
          id="dose"
          label="Dose"
          variant="outlined"
          value={prescriptionData.dose || ""}
          onChange={handlePrescriptionChange}
        />
        <TextField
          id="sig"
          label="Sig"
          variant="outlined"
          value={prescriptionData.sig || ""}
          onChange={handlePrescriptionChange}
        />

        {/* Mitte - quantity to dispense */}
        <TextField
          id="mitte"
          label="Mitte"
          variant="outlined"
          value={prescriptionData.mitte || ""}
          onChange={handlePrescriptionChange}
        />

        {/* Number of refills allowed */}
        <TextField
          id="refills"
          label="Refills"
          variant="outlined"
          value={prescriptionData.refills || ""}
          onChange={handlePrescriptionChange}
        />

        <br />

        {/* Pharmacist Information */}
        <TextField
          id="pharmacistName"
          label="Name"
          variant="outlined"
          value={pharmacistData.pharmacistName || ""}
          onChange={handlePharmacistChange}
        />
        <TextField
          id="licenseNumber"
          label="License Number"
          variant="outlined"
          value={pharmacistData.licenseNumber || ""}
          onChange={handlePharmacistChange}
        />
      </div>
    );
  };
}
