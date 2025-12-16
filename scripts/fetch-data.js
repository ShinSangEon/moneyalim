const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// ⚠️ REPLACE WITH YOUR ACTUAL API KEY FROM data.go.kr
const API_KEY = process.env.PUBLIC_DATA_API_KEY || "YOUR_DECODED_API_KEY_HERE";
const BASE_URL = "http://apis.data.go.kr/B554287/NationalWelfareInformations/NationalWelfarelist";

async function fetchSubsidies() {
  console.log("🚀 Starting Public Data Fetch...");

  try {
    // Example API call (Adjust parameters based on actual API docs)
    // This is a generic structure for the 'NationalWelfarelist' service
    const response = await axios.get(BASE_URL, {
      params: {
        serviceKey: API_KEY,
        numOfRows: 100,
        pageNo: 1,
        callTp: "L", // List type
      },
    });

    const items = response.data?.response?.body?.items?.item || [];

    if (items.length === 0) {
      console.log("⚠️ No data found. Check API Key or parameters.");
      return;
    }

    console.log(`✅ Fetched ${items.length} items. Saving to DB...`);

    for (const item of items) {
      // Map API response to our Schema
      // Note: Actual field names (servId, servNm, etc.) depend on the specific API documentation
      await prisma.subsidy.create({
        data: {
          title: item.servNm || "No Title",
          description: item.servDgst || "No Description",
          category: item.lifeNmArray || "General",
          target: item.trgterIndvdlArray || "All",
          // Add other mappings...
        },
      });
    }

    console.log("🎉 Data sync complete!");

  } catch (error) {
    console.error("❌ Error fetching data:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
  } finally {
    await prisma.$disconnect();
  }
}

fetchSubsidies();
