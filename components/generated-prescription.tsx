"use client";
import { Box } from "@mui/material";
import { PrescriptionData, PharmacistData } from "../types/prescription";

interface GeneratedPrescriptionProps {
  allPrescriptions: PrescriptionData[];
  pharmacistData?: PharmacistData;
}

export default function GeneratedPrescription({
  allPrescriptions,
  pharmacistData,
}: GeneratedPrescriptionProps) {
  const displayPrescriptionField = (label: string, value: string) => {
    if (value) {
      return (
        <p>
          {label}: {value}
        </p>
      );
    }
  };

  return (
    <Box sx={{ p: 2, border: "1px solid grey" }}>
      {allPrescriptions?.map((prescription, index) => (
        <div key={index}>
          <h3>
            <strong>Prescription {index + 1} </strong>
          </h3>

          {displayPrescriptionField("Medication", prescription.medicationName)}
          {displayPrescriptionField("Dose", prescription.dose)}
          {displayPrescriptionField("Sig", prescription.sig)}
          {displayPrescriptionField("Mitte", prescription.mitte)}

          {displayPrescriptionField("Refills", prescription.refills)}
          <hr />
        </div>
      ))}
      <div style={{ marginTop: "20px" }}>
        {displayPrescriptionField("Pharmacist", pharmacistData?.pharmacistName)}
        {displayPrescriptionField("License #", pharmacistData?.licenseNumber)}
      </div>
    </Box>
  );
}
