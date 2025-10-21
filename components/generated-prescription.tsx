"use client";
import { Paper } from "@mui/material";
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
    <Paper
      elevation={1}
      sx={{
        p: 3,
        border: "1px solid",
        borderColor: "grey.300",
        borderRadius: 2,
        lineHeight: 1.3,
      }}
    >
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
    </Paper>
  );
}
