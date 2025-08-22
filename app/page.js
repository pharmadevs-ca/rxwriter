'use client'
import { useEffect, useState } from 'react'
import { Button } from '@mui/material'
import PrescriptionInputs from '@/components/prescription-inputs'
import GeneratedPrescription from '@/components/generated-prescription'

export default function Home() {
  const [prescriptionData, setPrescriptionData] = useState()
  const [showGeneratedPrescription, setShowGeneratedPrescription] =
    useState(false)

  return (
    <div>
      <h1>Welcome to RxWriter</h1>

      <PrescriptionInputs
        prescriptionData={prescriptionData}
        setPrescriptionData={setPrescriptionData}
      />

      <Button
        onClick={() => {
          setShowGeneratedPrescription(!showGeneratedPrescription)
        }}
        variant='secondary'
      >
        Generate Prescription
      </Button>
      <br />
      <br />

      {showGeneratedPrescription && <GeneratedPrescription />}
    </div>
  )
}
