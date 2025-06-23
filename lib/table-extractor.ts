// Enhanced table extraction with more realistic data
export async function extractTables(pdfData: any): Promise<{ page: number; data: string[][]; headers?: string[] }[]> {
  const tables: { page: number; data: string[][]; headers?: string[] }[] = []

  const sampleTables = [
    {
      headers: ["Name", "Age", "Department", "Salary"],
      data: [
        ["John Smith", "32", "Engineering", "$75,000"],
        ["Jane Doe", "28", "Marketing", "$65,000"],
        ["Bob Johnson", "45", "Sales", "$80,000"],
        ["Alice Brown", "35", "HR", "$70,000"],
        ["Charlie Wilson", "29", "Engineering", "$72,000"],
      ],
    },
    {
      headers: ["Product", "Price", "Stock", "Category"],
      data: [
        ["Laptop", "$999", "25", "Electronics"],
        ["Mouse", "$29", "150", "Electronics"],
        ["Keyboard", "$79", "80", "Electronics"],
        ["Monitor", "$299", "45", "Electronics"],
        ["Webcam", "$89", "60", "Electronics"],
      ],
    },
    {
      headers: ["Date", "Revenue", "Expenses", "Profit"],
      data: [
        ["Jan 2024", "$50,000", "$30,000", "$20,000"],
        ["Feb 2024", "$55,000", "$32,000", "$23,000"],
        ["Mar 2024", "$48,000", "$28,000", "$20,000"],
        ["Apr 2024", "$62,000", "$35,000", "$27,000"],
        ["May 2024", "$58,000", "$33,000", "$25,000"],
      ],
    },
  ]

  // Simulate finding tables on random pages
  const numPages = pdfData.numpages || 1
  for (let page = 1; page <= numPages; page++) {
    // 20% chance of finding a table on each page
    if (Math.random() > 0.8) {
      const tableTemplate = sampleTables[Math.floor(Math.random() * sampleTables.length)]

      tables.push({
        page,
        headers: tableTemplate.headers,
        data: tableTemplate.data,
      })
    }
  }

  return tables
}
