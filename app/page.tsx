"use client";
import { useState } from "react";
import { Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import PrescriptionInputs from "@/components/prescription-inputs";
import GeneratedPrescription from "@/components/generated-prescription";
import { PrescriptionData, PharmacistData } from "@/types/prescription";

export default function Home() {
  const [allPrescriptions, setAllPrescriptions] = useState<PrescriptionData[]>(
    [],
  );
  const [prescriptionData, setPrescriptionData] = useState<PrescriptionData>(
    {},
  );
  const [pharmacistData, setPharmacistData] = useState<PharmacistData>({});

  return (
    <div>
      <h1>Welcome to RxWriter</h1>
      <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        <Grid container spacing={2} alignItems="flex-start">
          {/* LEFT SIDE: prescription input fields */}
          <Grid size={{ xs: 12, md: 6 }}>
            <PrescriptionInputs
              prescriptionData={prescriptionData}
              setPrescriptionData={setPrescriptionData}
              setPharmacistData={setPharmacistData}
              pharmacistData={pharmacistData}
            />

            <Button
              onClick={() => {
                if (prescriptionData.medicationName) {
                  setAllPrescriptions([...allPrescriptions, prescriptionData]);
                  setPrescriptionData({});
                }
              }}
              variant="outlined"
              sx={{ mt: 2 }}
            >
              Add Prescription
            </Button>
          </Grid>

          {/* RIGHT SIDE: generated rx preview */}
          <Grid size={{ xs: 12, md: 6 }}>
            {allPrescriptions.length > 0 ? (
              <GeneratedPrescription
                allPrescriptions={allPrescriptions}
                pharmacistData={pharmacistData}
              />
            ) : (
              <div
                style={{
                  opacity: 0.6,
                  border: "1px dashed #ccc",
                  borderRadius: 8,
                  padding: 16,
                }}
              >
                <p style={{ margin: 0 }}>
                  Your prescription preview will appear here after you add one.
                </p>
              </div>
            )}
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
