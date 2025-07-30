// Dummy data generator and manager
const generateDummyOrders = () => {
  const dummyOrders = [
    {
      id: "ORD-1704123456789",
      clientName: "Sarah Johnson",
      email: "sarah.johnson@techstartup.com",
      phone: "+1-555-0123",
      company: "TechStartup Inc.",
      projectType: "branding",
      services: ["Logo Design", "Business Card Design", "Website Graphics", "Social Media Graphics"],
      projectTitle: "Complete Brand Identity for Tech Startup",
      description:
        "We're a new fintech startup looking for a modern, professional brand identity. We want something that conveys trust, innovation, and accessibility. Our target market is young professionals aged 25-40 who are tech-savvy but want simple financial solutions.",
      budget: "2500-5000",
      deadline: "2024-03-15",
      priority: "high",
      status: "in-progress",
      communicationPreference: "email",
      revisionRounds: "3",
      fileFormat: ["PNG", "SVG", "PDF", "AI"],
      colorPreferences: "Blue and white with accent colors, modern corporate palette",
      targetAudience: "Young professionals, tech-savvy millennials, small business owners",
      additionalNotes:
        "Please include variations for dark and light backgrounds. We'll need the logo in horizontal and stacked versions.",
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-18T14:22:00Z",
    },
    {
      id: "ORD-1704098765432",
      clientName: "Michael Chen",
      email: "m.chen@restaurantgroup.com",
      phone: "+1-555-0456",
      company: "Golden Dragon Restaurant Group",
      projectType: "print-design",
      services: ["Menu Design", "Print Design", "Brochure Design"],
      projectTitle: "Restaurant Menu Redesign",
      description:
        "Need to redesign our restaurant menu with a more modern, appetizing look. Current menu feels outdated and doesn't showcase our dishes well.",
      budget: "500-1000",
      deadline: "2024-02-28",
      priority: "normal",
      status: "pending",
      communicationPreference: "phone",
      revisionRounds: "2",
      fileFormat: ["PDF", "PNG"],
      colorPreferences: "Warm colors, gold accents, elegant feel",
      targetAudience: "Families, food enthusiasts, upscale dining customers",
      additionalNotes: "Menu should be easy to read with good food photography integration",
      createdAt: "2024-01-12T09:15:00Z",
      updatedAt: "2024-01-12T09:15:00Z",
    },
    {
      id: "ORD-1703987654321",
      clientName: "Emily Rodriguez",
      email: "emily.r.author@gmail.com",
      phone: "+1-555-0789",
      company: "",
      projectType: "illustration",
      services: ["Book Cover Design", "Illustration", "Character Design"],
      projectTitle: "Fantasy Novel Book Cover",
      description:
        "I'm an indie author publishing my first fantasy novel. Need an eye-catching book cover that will stand out on Amazon and in bookstores. The story involves dragons, magic, and a strong female protagonist.",
      budget: "under-500",
      deadline: "2024-02-10",
      priority: "urgent",
      status: "completed",
      communicationPreference: "email",
      revisionRounds: "unlimited",
      fileFormat: ["JPG", "PNG", "PDF"],
      colorPreferences: "Dark, mystical colors with magical elements",
      targetAudience: "Fantasy readers, young adults, book lovers",
      additionalNotes: "Need both ebook and print versions. Should work well as a thumbnail image.",
      createdAt: "2024-01-05T16:45:00Z",
      updatedAt: "2024-01-20T11:30:00Z",
    },
    {
      id: "ORD-1704234567890",
      clientName: "David Thompson",
      email: "david@fitnessstudio.com",
      phone: "+1-555-0321",
      company: "PowerFit Gym",
      projectType: "digital-art",
      services: ["Social Media Graphics", "Website Graphics", "Digital Art"],
      projectTitle: "Gym Social Media Campaign Graphics",
      description:
        "Need a series of motivational graphics for our gym's social media campaigns. Looking for energetic, inspiring designs that will motivate people to join our gym.",
      budget: "1000-2500",
      deadline: "2024-03-01",
      priority: "normal",
      status: "on-hold",
      communicationPreference: "video-call",
      revisionRounds: "5",
      fileFormat: ["PNG", "JPG"],
      colorPreferences: "Bold, energetic colors - red, black, white",
      targetAudience: "Fitness enthusiasts, people looking to get in shape, athletes",
      additionalNotes: "Need templates that can be easily modified for different campaigns",
      createdAt: "2024-01-20T13:20:00Z",
      updatedAt: "2024-01-22T10:15:00Z",
    },
    {
      id: "ORD-1703876543210",
      clientName: "Lisa Park",
      email: "lisa.park@nonprofitorg.org",
      phone: "+1-555-0654",
      company: "Green Earth Foundation",
      projectType: "graphic-design",
      services: ["Logo Design", "Brochure Design", "Print Design"],
      projectTitle: "Non-profit Environmental Campaign Materials",
      description:
        "We're launching a new environmental awareness campaign and need professional materials including updated logo, brochures, and flyers.",
      budget: "500-1000",
      deadline: "2024-04-22",
      priority: "low",
      status: "cancelled",
      communicationPreference: "email",
      revisionRounds: "3",
      fileFormat: ["PDF", "PNG", "SVG"],
      colorPreferences: "Earth tones, green, natural colors",
      targetAudience: "Environmentally conscious individuals, community members, donors",
      additionalNotes: "Budget is limited as we're a non-profit. Looking for impactful but cost-effective designs.",
      createdAt: "2024-01-08T11:00:00Z",
      updatedAt: "2024-01-25T09:45:00Z",
    },
  ]

  return dummyOrders
}

const generateDummyClients = () => {
  return [
    {
      id: "CLIENT-1704123456789",
      name: "Sarah Johnson",
      email: "sarah.johnson@techstartup.com",
      phone: "+1-555-0123",
      company: "TechStartup Inc.",
      totalOrders: 3,
      totalSpent: 8500,
      lastOrderDate: "2024-01-18T14:22:00Z",
      createdAt: "2024-01-01T10:00:00Z",
    },
    {
      id: "CLIENT-1704098765432",
      name: "Michael Chen",
      email: "m.chen@restaurantgroup.com",
      phone: "+1-555-0456",
      company: "Golden Dragon Restaurant Group",
      totalOrders: 2,
      totalSpent: 1500,
      lastOrderDate: "2024-01-12T09:15:00Z",
      createdAt: "2024-01-05T15:30:00Z",
    },
    {
      id: "CLIENT-1703987654321",
      name: "Emily Rodriguez",
      email: "emily.r.author@gmail.com",
      phone: "+1-555-0789",
      company: "",
      totalOrders: 1,
      totalSpent: 450,
      lastOrderDate: "2024-01-20T11:30:00Z",
      createdAt: "2024-01-05T16:45:00Z",
    },
  ]
}

// Initialize dummy data
export const initializeDummyData = () => {
  const existingOrders = localStorage.getItem("orders")
  const existingClients = localStorage.getItem("clients")

  if (!existingOrders || existingOrders === "[]") {
    const dummyOrders = generateDummyOrders()
    localStorage.setItem("orders", JSON.stringify(dummyOrders))
    console.log("Dummy orders initialized:", dummyOrders.length, "orders")
  }

  if (!existingClients || existingClients === "[]") {
    const dummyClients = generateDummyClients()
    localStorage.setItem("clients", JSON.stringify(dummyClients))
    console.log("Dummy clients initialized:", dummyClients.length, "clients")
  }
}

// Merge API data with dummy data
export const mergeWithDummyData = (apiData, dummyData, keyField = "id") => {
  if (!Array.isArray(apiData) || !Array.isArray(dummyData)) {
    return Array.isArray(apiData) ? apiData : dummyData || []
  }

  const merged = [...dummyData]

  apiData.forEach((apiItem) => {
    const existingIndex = merged.findIndex((item) => item && apiItem && item[keyField] === apiItem[keyField])

    if (existingIndex >= 0) {
      // Update existing item with API data
      merged[existingIndex] = { ...merged[existingIndex], ...apiItem }
    } else {
      // Add new API item
      merged.push(apiItem)
    }
  })

  return merged
}

export { generateDummyOrders, generateDummyClients }
