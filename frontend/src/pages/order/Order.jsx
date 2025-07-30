"use client"

import { useState } from "react"
import styled from "styled-components"
import { API_CONFIG, apiCall } from "../../../api-config"
import { initializeDummyData } from "../dashboard/dummy-data"

// Initialize dummy data when component loads
initializeDummyData()

const FormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`

const Title = styled.h1`
  color: #333;
  text-align: center;
  margin-bottom: 2rem;
`

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
`

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #007bff;
  }

  &:invalid {
    border-color: #dc3545;
  }
`

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`

const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`

const Checkbox = styled.input`
  width: auto;
`

const FileUpload = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px dashed #ddd;
  border-radius: 4px;
  background: #f8f9fa;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`

const Button = styled.button`
  background: #007bff;
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s;

  &:hover {
    background: #0056b3;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  text-align: center;
`

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  text-align: center;
`

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;
  margin-right: 10px;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`

const PriorityBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-left: 0.5rem;
  
  ${(props) => {
    switch (props.priority) {
      case "urgent":
        return "background: #dc3545; color: white;"
      case "high":
        return "background: #fd7e14; color: white;"
      case "normal":
        return "background: #28a745; color: white;"
      case "low":
        return "background: #6c757d; color: white;"
      default:
        return "background: #e9ecef; color: #495057;"
    }
  }}
`

const ApiStatusIndicator = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.8rem;
  z-index: 1000;
  
  ${(props) => {
    switch (props.status) {
      case "api":
        return "background: #d4edda; color: #155724;"
      case "local":
        return "background: #fff3cd; color: #856404;"
      case "error":
        return "background: #f8d7da; color: #721c24;"
      default:
        return "background: #e2e3e5; color: #383d41;"
    }
  }}
`

// Utility functions for null safety
const safeString = (value) => value || ""
const safeArray = (value) => (Array.isArray(value) ? value : [])

const OrderForm = () => {
  const [formData, setFormData] = useState({
    clientName: "",
    email: "",
    phone: "",
    company: "",
    projectType: "",
    services: [],
    projectTitle: "",
    description: "",
    budget: "",
    deadline: "",
    priority: "normal",
    referenceFiles: null,
    additionalNotes: "",
    communicationPreference: "email",
    revisionRounds: "3",
    fileFormat: [],
    colorPreferences: "",
    targetAudience: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [dataSource, setDataSource] = useState("unknown")

  const serviceOptions = [
    "Logo Design",
    "Business Card Design",
    "Brochure Design",
    "Website Graphics",
    "Social Media Graphics",
    "Illustration",
    "Character Design",
    "Book Cover Design",
    "Packaging Design",
    "Print Design",
  ]

  const fileFormatOptions = ["PNG", "JPG", "SVG", "PDF", "AI", "PSD", "EPS"]

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target

    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files && files[0] ? files[0] : null,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: safeString(value),
      }))
    }
  }

  const handleServiceChange = (service) => {
    setFormData((prev) => ({
      ...prev,
      services: safeArray(prev.services).includes(service)
        ? safeArray(prev.services).filter((s) => s !== service)
        : [...safeArray(prev.services), service],
    }))
  }

  const handleFileFormatChange = (format) => {
    setFormData((prev) => ({
      ...prev,
      fileFormat: safeArray(prev.fileFormat).includes(format)
        ? safeArray(prev.fileFormat).filter((f) => f !== format)
        : [...safeArray(prev.fileFormat), format],
    }))
  }

  const submitToAPI = async (orderData) => {
    try {
      const result = await apiCall(API_CONFIG.endpoints.orders, {
        method: "POST",
        body: JSON.stringify(orderData),
      })

      if (result && result.success) {
        setDataSource("api")
        return result
      } else {
        throw new Error(result?.message || "API submission failed")
      }
    } catch (error) {
      console.warn("API submission failed:", error.message)
      throw error
    }
  }

  const submitToLocalStorage = (orderData) => {
    try {
      const orderId = "ORD-" + Date.now()
      const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]")

      const newOrder = {
        id: orderId,
        ...orderData,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      existingOrders.push(newOrder)
      localStorage.setItem("orders", JSON.stringify(existingOrders))
      setDataSource("local")

      return {
        success: true,
        data: newOrder,
        message: "Order saved locally",
      }
    } catch (error) {
      console.error("Local storage failed:", error)
      throw error
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)
    setErrorMessage("")

    try {
      // Normalize form data with null safety
      const orderData = {
        clientName: safeString(formData.clientName),
        email: safeString(formData.email),
        phone: safeString(formData.phone),
        company: safeString(formData.company),
        projectType: safeString(formData.projectType),
        services: safeArray(formData.services),
        projectTitle: safeString(formData.projectTitle),
        description: safeString(formData.description),
        budget: safeString(formData.budget),
        deadline: safeString(formData.deadline),
        priority: safeString(formData.priority) || "normal",
        communicationPreference: safeString(formData.communicationPreference) || "email",
        revisionRounds: safeString(formData.revisionRounds) || "3",
        fileFormat: safeArray(formData.fileFormat),
        colorPreferences: safeString(formData.colorPreferences),
        targetAudience: safeString(formData.targetAudience),
        additionalNotes: safeString(formData.additionalNotes),
      }

      let result

      if (API_CONFIG.useAPI) {
        try {
          // Try API first
          result = await submitToAPI(orderData)
        } catch (apiError) {
          console.warn("API failed, falling back to localStorage:", apiError.message)
          // Fallback to localStorage
          result = submitToLocalStorage(orderData)
        }
      } else {
        // Use localStorage only
        result = submitToLocalStorage(orderData)
      }

      if (result && result.success) {
        setSubmitStatus("success")

        // Reset form after 3 seconds
        setTimeout(() => {
          setSubmitStatus(null)
          setFormData({
            clientName: "",
            email: "",
            phone: "",
            company: "",
            projectType: "",
            services: [],
            projectTitle: "",
            description: "",
            budget: "",
            deadline: "",
            priority: "normal",
            referenceFiles: null,
            additionalNotes: "",
            communicationPreference: "email",
            revisionRounds: "3",
            fileFormat: [],
            colorPreferences: "",
            targetAudience: "",
          })
          setDataSource("unknown")
        }, 3000)
      } else {
        throw new Error("Submission failed")
      }
    } catch (error) {
      setSubmitStatus("error")
      setErrorMessage(error.message || "Failed to submit order")
      setDataSource("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitStatus === "success") {
    return (
      <FormContainer>
        <ApiStatusIndicator status={dataSource}>
          {dataSource === "api" ? "✓ Saved to API" : dataSource === "local" ? "✓ Saved Locally" : "✓ Saved"}
        </ApiStatusIndicator>
        <SuccessMessage>
          <h2>Order Submitted Successfully!</h2>
          <p>Thank you for your order. We'll get back to you soon.</p>
          <p>
            <small>Data source: {dataSource === "api" ? "API Server" : "Local Storage"}</small>
          </p>
        </SuccessMessage>
      </FormContainer>
    )
  }

  return (
    <FormContainer>
      {dataSource !== "unknown" && (
        <ApiStatusIndicator status={dataSource}>
          {dataSource === "api"
            ? "API Connected"
            : dataSource === "local"
              ? "Using Local Storage"
              : dataSource === "error"
                ? "Connection Error"
                : ""}
        </ApiStatusIndicator>
      )}

      <Title>Freelance Design Order Form</Title>

      {submitStatus === "error" && <ErrorMessage>Error: {errorMessage}</ErrorMessage>}

      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="clientName">Full Name *</Label>
          <Input
            type="text"
            id="clientName"
            name="clientName"
            value={safeString(formData.clientName)}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={safeString(formData.email)}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="phone">Phone Number</Label>
          <Input type="tel" id="phone" name="phone" value={safeString(formData.phone)} onChange={handleInputChange} />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="company">Company/Organization</Label>
          <Input
            type="text"
            id="company"
            name="company"
            value={safeString(formData.company)}
            onChange={handleInputChange}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="projectType">Project Type *</Label>
          <Select
            id="projectType"
            name="projectType"
            value={safeString(formData.projectType)}
            onChange={handleInputChange}
            required
          >
            <option value="">Select project type</option>
            <option value="graphic-design">Graphic Design</option>
            <option value="illustration">Art Illustration</option>
            <option value="branding">Branding Package</option>
            <option value="digital-art">Digital Art</option>
            <option value="print-design">Print Design</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Services Needed *</Label>
          <CheckboxGroup>
            {serviceOptions.map((service) => (
              <CheckboxLabel key={service}>
                <Checkbox
                  type="checkbox"
                  checked={safeArray(formData.services).includes(service)}
                  onChange={() => handleServiceChange(service)}
                />
                {service}
              </CheckboxLabel>
            ))}
          </CheckboxGroup>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="projectTitle">Project Title *</Label>
          <Input
            type="text"
            id="projectTitle"
            name="projectTitle"
            value={safeString(formData.projectTitle)}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="priority">
            Priority Level *
            <PriorityBadge priority={safeString(formData.priority) || "normal"}>
              {(safeString(formData.priority) || "normal").toUpperCase()}
            </PriorityBadge>
          </Label>
          <Select
            id="priority"
            name="priority"
            value={safeString(formData.priority) || "normal"}
            onChange={handleInputChange}
            required
          >
            <option value="low">Low Priority</option>
            <option value="normal">Normal Priority</option>
            <option value="high">High Priority</option>
            <option value="urgent">Urgent</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description">Project Description *</Label>
          <TextArea
            id="description"
            name="description"
            value={safeString(formData.description)}
            onChange={handleInputChange}
            placeholder="Please describe your project in detail, including style preferences, target audience, and any specific requirements..."
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="targetAudience">Target Audience</Label>
          <Input
            type="text"
            id="targetAudience"
            name="targetAudience"
            value={safeString(formData.targetAudience)}
            onChange={handleInputChange}
            placeholder="e.g., Young professionals, Tech startups, Healthcare industry"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="colorPreferences">Color Preferences</Label>
          <Input
            type="text"
            id="colorPreferences"
            name="colorPreferences"
            value={safeString(formData.colorPreferences)}
            onChange={handleInputChange}
            placeholder="e.g., Blue and white, Warm colors, Corporate colors"
          />
        </FormGroup>

        <FormGroup>
          <Label>Required File Formats</Label>
          <CheckboxGroup>
            {fileFormatOptions.map((format) => (
              <CheckboxLabel key={format}>
                <Checkbox
                  type="checkbox"
                  checked={safeArray(formData.fileFormat).includes(format)}
                  onChange={() => handleFileFormatChange(format)}
                />
                {format}
              </CheckboxLabel>
            ))}
          </CheckboxGroup>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="budget">Budget Range *</Label>
          <Select id="budget" name="budget" value={safeString(formData.budget)} onChange={handleInputChange} required>
            <option value="">Select budget range</option>
            <option value="under-500">Under $500</option>
            <option value="500-1000">$500 - $1,000</option>
            <option value="1000-2500">$1,000 - $2,500</option>
            <option value="2500-5000">$2,500 - $5,000</option>
            <option value="over-5000">Over $5,000</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="revisionRounds">Number of Revision Rounds</Label>
          <Select
            id="revisionRounds"
            name="revisionRounds"
            value={safeString(formData.revisionRounds) || "3"}
            onChange={handleInputChange}
          >
            <option value="1">1 Revision</option>
            <option value="2">2 Revisions</option>
            <option value="3">3 Revisions</option>
            <option value="5">5 Revisions</option>
            <option value="unlimited">Unlimited Revisions</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="deadline">Preferred Deadline</Label>
          <Input
            type="date"
            id="deadline"
            name="deadline"
            value={safeString(formData.deadline)}
            onChange={handleInputChange}
            min={new Date().toISOString().split("T")[0]}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="communicationPreference">Communication Preference</Label>
          <Select
            id="communicationPreference"
            name="communicationPreference"
            value={safeString(formData.communicationPreference) || "email"}
            onChange={handleInputChange}
          >
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="video-call">Video Call</option>
            <option value="messaging">Messaging App</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="referenceFiles">Reference Files</Label>
          <FileUpload
            type="file"
            id="referenceFiles"
            name="referenceFiles"
            onChange={handleInputChange}
            accept="image/*,.pdf,.doc,.docx"
            multiple
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="additionalNotes">Additional Notes</Label>
          <TextArea
            id="additionalNotes"
            name="additionalNotes"
            value={safeString(formData.additionalNotes)}
            onChange={handleInputChange}
            placeholder="Any additional information or special requests..."
          />
        </FormGroup>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <LoadingSpinner />}
          {isSubmitting ? "Submitting Order..." : "Submit Order"}
        </Button>
      </form>
    </FormContainer>
  )
}

export default OrderForm
