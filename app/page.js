'use client'
import { useEffect, useState } from 'react'
import { Button, Grid } from '@mui/material'
import PrescriptionInputs from '@/components/prescription-inputs'
import GeneratedPrescription from '@/components/generated-prescription'

export default function Home() {
  const [prescriptionData, setPrescriptionData] = useState()
  const [showGeneratedPrescription, setShowGeneratedPrescription] =
    useState(false)

  return (
    <div>
      <h1>Welcome to RxWriter</h1>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <PrescriptionInputs
            prescriptionData={prescriptionData}
            setPrescriptionData={setPrescriptionData}
          />

          <Button
            onClick={() => {
              setShowGeneratedPrescription(!showGeneratedPrescription)
            }}
            variant='contained'
            sx={{ mt: 2 }}
          >
            Generate Prescription
          </Button>
        </Grid>
        <br />
        <br />
        <Grid
          item
          xs={6}
          sx={{
            maxWidth: '600px',
            wordbreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {showGeneratedPrescription && <GeneratedPrescription />}
        </Grid>
      </Grid>
    </div>
  )
}
