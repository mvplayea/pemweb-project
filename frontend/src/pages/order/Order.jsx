"use client"

import { useState } from "react"
import styled from "styled-components"
import axios from "axios"

// A wrapper to add the consistent purple underline to the title
const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 3rem;
`

const Title = styled.h1`
  color: #f9fafb; // Brighter white for the main title
  text-align: center;
  font-family: 'Poppins', sans-serif;
  font-size: 3rem;
  margin: 0;
`

// Using the same underline style from other sections
const Underline = styled.div`
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #A855F7, #D946EF);
  margin-top: 0.75rem;
`

const FormContainer = styled.div`
  width: 100%;
  max-width: 800px; // Set a max-width for better readability on large screens
  margin: 4rem auto;
  padding: 3rem;
  background: #18181B; // A very dark grey, not quite black
  border-radius: 12px;
  border: 1px solid #27272A;
`

const FormGroup = styled.div`
  width: 100%; // Corrected from 90%:
  margin-bottom: 1.5rem;
`

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #a1a1aa; // Softer grey for labels
`

// A common base for all input-like fields
const inputStyles = `
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1px solid #3f3f46;
  border-radius: 6px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  background: #27272A;
  color: #f9fafb;
  transition: border-color 0.3s, box-shadow 0.3s;

  &::placeholder {
    color: #71717A;
  }

  &:focus {
    outline: none;
    border-color: #a855f7; // Use the theme's primary accent color
    box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.2); // A subtle glow effect
  }

  &:invalid {
    border-color: #f87171; // A more visible error color for dark mode
  }
`

const Input = styled.input`
  ${inputStyles}
`

const Select = styled.select`
  ${inputStyles}
`

const TextArea = styled.textarea`
  ${inputStyles}
  min-height: 120px;
  resize: vertical;
`

const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  background-color: #27272A;
  padding: 1.5rem;
  border-radius: 6px;
  border: 1px solid #3f3f46;
`

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  color: #d4d4d8;
`

const Checkbox = styled.input`
  width: 1.15em;
  height: 1.15em;
  cursor: pointer;
  accent-color: #a855f7; // Modern CSS to theme the checkbox color
`

const Button = styled.button`
  background: linear-gradient(90deg, #A855F7, #D946EF);
  color: white;
  padding: 0.85rem 2rem;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  width: 100%;
  transition: transform 0.2s, filter 0.2s;

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.1);
  }

  &:disabled {
    background: #4b5563;
    cursor: not-allowed;
    transform: none;
    filter: none;
  }
`

const SuccessMessage = styled.div`
  background: #042f2e; // Dark green background
  color: #a7f3d0; // Light mint color for text
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid #5eead4;
  margin-bottom: 1rem;
  text-align: center;

  h2 { margin-top: 0; }
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
    "Logo Design", "Business Card", "Brochure", "Website Graphics",
    "Social Media", "Illustration", "Character Design", "Book Cover",
    "Packaging", "Print Design",
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleServiceChange = (service) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newOrder = {
      ...formData,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const response = await axios.post("https://api-alle.noxturne.my.id/projects", newOrder);

      if (response.status === 201) {
        setIsSubmitted(true);
        // Reset form fields
        setFormData({
          clientName: "", email: "", phone: "", projectType: "", services: [],
          projectTitle: "", description: "", budget: "", deadline: "",
          referenceFiles: "", additionalNotes: "",
        });
      } else {
        console.error("Failed to submit order: Server responded with status " + response.status);
        alert("There was an issue submitting your order. Please try again.");
      }
    } catch (error) {
      console.error("An error occurred while submitting the order:", error);
      alert("An error occurred. Please check the console and try again.");
    }
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
      <TitleWrapper>
        <Title>Freelance Design Order</Title>
        <Underline />
      </TitleWrapper>

      <form onSubmit={handleSubmit}>
        {/* The rest of your form JSX remains exactly the same. */}
        {/* ... From <FormGroup> for Full Name to the closing </form> tag ... */}

        {/* Example of one FormGroup just to show no changes are needed here */}
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

        {/* ... Paste the rest of your form groups here ... */}

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
          <Select id="projectType" name="projectType" value={formData.projectType} onChange={handleInputChange} required >
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
          <Input type="text" id="projectTitle" name="projectTitle" value={formData.projectTitle} onChange={handleInputChange} required />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description">Project Description *</Label>
          <TextArea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Please describe your project in detail..." required />
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
          <Input type="date" id="deadline" name="deadline" value={formData.deadline} onChange={handleInputChange} min={new Date().toISOString().split("T")[0]} />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="referenceFiles">Reference Files/Links</Label>
          <TextArea id="referenceFiles" name="referenceFiles" value={formData.referenceFiles} onChange={handleInputChange} placeholder="Please provide links to reference images, inspiration..." />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="additionalNotes">Additional Notes</Label>
          <TextArea id="additionalNotes" name="additionalNotes" value={formData.additionalNotes} onChange={handleInputChange} placeholder="Any additional information or special requests..." />
        </FormGroup>

        <Button type="submit">Submit Order</Button>
      </form>
    </FormContainer>
  )
}

export default Order
