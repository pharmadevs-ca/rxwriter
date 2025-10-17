"use client";
import { useState } from "react";
import { Button, Grid } from "@mui/material";
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
            sx={{ mt: 2, ml: 2 }}
          >
            Add Prescription
          </Button>
        </Grid>

        {allPrescriptions.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <GeneratedPrescription
              allPrescriptions={allPrescriptions}
              pharmacistData={pharmacistData}
            />
          </Grid>
        )}
      </div>
    </div>
  );
}
