"use client"

import { useState } from "react"
import styled from "styled-components"

const FormContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 1rem;
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
  width: 90%:
  margin-bottom: 2rem;
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

const Order = () => {
  const [formData, setFormData] = useState({
    clientName: "",
    email: "",
    phone: "",
    projectType: "",
    services: [],
    projectTitle: "",
    description: "",
    budget: "",
    deadline: "",
    referenceFiles: "",
    additionalNotes: "",
  })

  const [isSubmitted, setIsSubmitted] = useState(false)

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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleServiceChange = (service) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Generate order ID
    const orderId = "ORD-" + Date.now()

    // Get existing orders from localStorage
    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]")

    // Add new order
    const newOrder = {
      id: orderId,
      ...formData,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    existingOrders.push(newOrder)
    localStorage.setItem("orders", JSON.stringify(existingOrders))

    setIsSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        clientName: "",
        email: "",
        phone: "",
        projectType: "",
        services: [],
        projectTitle: "",
        description: "",
        budget: "",
        deadline: "",
        referenceFiles: "",
        additionalNotes: "",
      })
    }, 3000)
  }

  if (isSubmitted) {
    return (
      <FormContainer>
        <SuccessMessage>
          <h2>Order Submitted Successfully!</h2>
          <p>Thank you for your order. We'll get back to you soon.</p>
        </SuccessMessage>
      </FormContainer>
    )
  }

  return (
    <FormContainer>
      <Title>Freelance Design Order Form</Title>

      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="clientName">Full Name *</Label>
          <Input
            type="text"
            id="clientName"
            name="clientName"
            value={formData.clientName}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="email">Email Address *</Label>
          <Input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="phone">Phone Number</Label>
          <Input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="projectType">Project Type *</Label>
          <Select
            id="projectType"
            name="projectType"
            value={formData.projectType}
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
                  checked={formData.services.includes(service)}
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
            value={formData.projectTitle}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description">Project Description *</Label>
          <TextArea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Please describe your project in detail, including style preferences, target audience, and any specific requirements..."
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="budget">Budget Range *</Label>
          <Select id="budget" name="budget" value={formData.budget} onChange={handleInputChange} required>
            <option value="">Select budget range</option>
            <option value="under-500">Under $500</option>
            <option value="500-1000">$500 - $1,000</option>
            <option value="1000-2500">$1,000 - $2,500</option>
            <option value="2500-5000">$2,500 - $5,000</option>
            <option value="over-5000">Over $5,000</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="deadline">Preferred Deadline</Label>
          <Input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleInputChange}
            min={new Date().toISOString().split("T")[0]}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="referenceFiles">Reference Files/Links</Label>
          <TextArea
            id="referenceFiles"
            name="referenceFiles"
            value={formData.referenceFiles}
            onChange={handleInputChange}
            placeholder="Please provide links to reference images, inspiration, or any files that help explain your vision..."
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="additionalNotes">Additional Notes</Label>
          <TextArea
            id="additionalNotes"
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleInputChange}
            placeholder="Any additional information or special requests..."
          />
        </FormGroup>

        <Button type="submit">Submit Order</Button>
      </form>
    </FormContainer>
  )
}

export default Order
