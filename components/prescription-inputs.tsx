"use client";
import { TextField } from "@mui/material";
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
  const handlePrescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrescriptionData({ ...prescriptionData, [e.target.id]: e.target.value });
  };

  const handlePharmacistChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPharmacistData({ ...pharmacistData, [e.target.id]: e.target.value });
  };

  return (
    <div className="flex flex-col gap-4">
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
      <TextField
        id="mitte"
        label="Mitte"
        variant="outlined"
        value={prescriptionData.mitte || ""}
        onChange={handlePrescriptionChange}
      />
      <TextField
        id="refills"
        label="Refills"
        variant="outlined"
        value={prescriptionData.refills || ""}
        onChange={handlePrescriptionChange}
      />
      <br />
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
}
