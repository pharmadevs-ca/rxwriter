"use client";
import { TextField } from "@mui/material";

export default function PrescriptionInputs(props) {
  const { prescriptionData, setPrescriptionData } = props;

  const handleChange = (e) => {
    setPrescriptionData({ ...prescriptionData, [e.target.id]: e.target.value });
  };
  return (
    <div className="flex flex-col gap-4">
      <TextField
        id="medicationName"
        label="Medication Name"
        variant="outlined"
        onChange={handleChange}
      />

      <TextField
        id="dose"
        label="Dose"
        variant="outlined"
        onChange={handleChange}
      />
      <TextField
        id="sig"
        label="Sig"
        variant="outlined"
        onChange={handleChange}
      />
      <TextField
        id="mitte"
        label="Mitte"
        variant="outlined"
        onChange={handleChange}
      />
      <TextField
        id="refills"
        label="Refills"
        variant="outlined"
        onChange={handleChange}
      />
      <br />
      <TextField
        id="pharmacistName"
        label="Name"
        variant="outlined"
        onChange={handleChange}
      />
      <TextField
        id="licenseNumber"
        label="License Number"
        variant="outlined"
        onChange={handleChange}
      />
    </div>
  );
}
