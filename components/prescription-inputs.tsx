"use client";
import { TextField } from "@mui/material";
import { drugList } from "@/data/drugs";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export default function PrescriptionInputs(props) {
  const { prescriptionData, setPrescriptionData } = props;

  const handleChange = (e) => {
    setPrescriptionData({ ...prescriptionData, [e.target.id]: e.target.value });
  };
  return (
    <div className="flex flex-col gap-4">
      <FormControl fullWidth>
        <InputLabel id="medicationName-label">Medication Name</InputLabel>
        <Select
          labelId="medicationName-label"
          id="medicationName"
          value={prescriptionData?.medicationName || ""}
          onChange={(e) =>
            setPrescriptionData({
              ...prescriptionData,
              medicationName: e.target.value,
            })
          }
        >
          {drugList.map((drug, index) => (
            <MenuItem key={index} value={drug.name}>
              {drug.name} – {drug.strength} ({drug.form})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

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
