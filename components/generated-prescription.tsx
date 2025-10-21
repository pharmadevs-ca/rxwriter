"use client";
import { Box, Paper, Divider, Stack, Typography, Chip } from "@mui/material";
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
        m: 3,
        border: "1px solid",
        borderColor: "grey.300",
        borderRadius: 2,
        lineHeight: 1.3,
      }}
    >
      {/* ---- Rx header with chip ---- */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Chip label="Rx" color="gray" size="small" />
          <Typography variant="h6" fontWeight={700}>
            Prescription
          </Typography>
        </Stack>
      </Stack>
      <Divider sx={{ mb: 2 }} />
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
        </div>
      ))}
      <Divider sx={{ m: 2 }} />
      {displayPrescriptionField("Pharmacist", pharmacistData?.pharmacistName)}
      {displayPrescriptionField("License #", pharmacistData?.licenseNumber)}
    </Paper>
  );
}
