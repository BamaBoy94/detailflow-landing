export type VehicleSize       = 'sedan' | 'suv' | 'truck'
export type Condition         = 'light' | 'moderate' | 'heavy'
export type Urgency           = 'asap' | 'this_week' | 'flexible'
export type JobStatus         = 'new' | 'assigned' | 'completed'
export type JobTag            = 'URGENT' | 'SPECIALTY' | 'HIGH VALUE'

export type ServiceKey =
  | 'interior'
  | 'exterior'
  | 'pet_hair'
  | 'odor_removal'
  | 'ceramic_coating'

export interface JobFormValues {
  name:               string
  phone:              string
  address:            string
  vehicleMake:        string
  vehicleModel:       string
  vehicleSize:        VehicleSize | ''
  interiorCondition:  Condition   | ''
  exteriorCondition:  Condition   | ''
  services:           ServiceKey[]
  urgency:            Urgency     | ''
  notes:              string
  photoNames:         string[]
}

export interface Job {
  id:        string
  createdAt: string       // ISO string
  values:    JobFormValues
  tags:      JobTag[]
  status:    JobStatus
}
