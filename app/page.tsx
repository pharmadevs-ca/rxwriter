"use client";
import { useState } from "react";
import { Button, Grid } from "@mui/material";
import PrescriptionInputs from "@/components/prescription-inputs";
import GeneratedPrescription from "@/components/generated-prescription";

export default function Home() {
  const [prescriptionData, setPrescriptionData] = useState();
  const [showGeneratedPrescription, setShowGeneratedPrescription] =
    useState(false);

  return (
    <div>
      <h1>Welcome to RxWriter</h1>
      <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        <Grid container spacing={3}>
          // TODO: upgrade to grid v2
          <Grid item xs={12} md={6}>
            <PrescriptionInputs
              prescriptionData={prescriptionData}
              setPrescriptionData={setPrescriptionData}
            />
            <Button
              onClick={() => {
                setShowGeneratedPrescription(!showGeneratedPrescription);
              }}
              variant="contained"
              sx={{ mt: 2 }}
            >
              Generate Prescription
            </Button>
          </Grid>
          // TODO: upgrade to grid v2
          <Grid item xs={12} md={6}>
            {showGeneratedPrescription && (
              <div
                style={{
                  maxWidth: "600px",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                <GeneratedPrescription />
              </div>
            )}
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
