"use client"
import { Card } from "@/components/ui/card"

interface GoodsDetails {
  sr: number
  lrNo: string
  from: string
  to: string
  invNo: string
  rate: number
  otherCharges: number
  freightAmt: number
}

interface FreightBillProps {
  companyName: string
  companyTagline: string
  companyAddress: string
  contactNumbers: string[]
  serviceDetails: string[]
  billNo: string
  location: string
  date: string
  recipient: {
    name: string
    address: string[]
  }
  goodsDetails: GoodsDetails[]
  totalAmount: number
  remark: string
  panNo: string
  gstin: string
  serviceTaxPayableBy: "Consignor" | "Consignee"
}

export default function FreightBill({
  companyName = "Shree Dattaguru Road Lines",
  companyTagline = "Transport Contractors & Fleet Owners",
  companyAddress = "Plot No. W - 4, Camlin Naka, MIDC, Tarapur.",
  contactNumbers = ["9823364283", "9168027869", "7276272828"],
  serviceDetails = [
    "Daily Part Load Service to -",
    "Tarapur, Bhiwandi, Palghar,",
    "Vashi, Taloja, Kolgoan Genises",
    "& Full Load to all over India",
  ],
  billNo = "TPR - 8482",
  location = "TARAPUR",
  date = "",
  recipient = {
    name: "",
    address: [""],
  },
  goodsDetails = [],
  totalAmount = 0,
  remark = "",
  panNo = "AGTPV0112D",
  gstin = "27AGTPV0112D1ZG",
  serviceTaxPayableBy = "Consignor",
}: Partial<FreightBillProps>) {  return (
    <Card className="w-full max-w-4xl mx-auto p-6 bg-white border-gray-300 border-2 print:border-0 print:shadow-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between border-b-2 border-gray-700 pb-2">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 border-2 border-gray-700 rounded-full flex items-center justify-center overflow-hidden">
            <img 
              src="/backend/assets/images/dattaguru_invoice.webp" 
              alt="Company Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-blue-800">{companyName}</h1>
            <div className="text-lg font-semibold border-b border-gray-700 text-blue-800">{companyTagline}</div>
          </div>
        </div>
        <div className="text-sm mt-2 md:mt-0 md:text-right">
          <div>Mob.: {contactNumbers.join(", ")}</div>
          {serviceDetails.map((detail, index) => (
            <div key={index}>{detail}</div>
          ))}
        </div>
      </div>

      {/* Freight Bill Title */}
      <div className="flex justify-between items-center my-2">
        <div className="font-bold text-lg">FREIGHT BILL</div>
        <div className="text-sm">{companyAddress}</div>
      </div>

      {/* Bill Details */}
      <div className="flex flex-col md:flex-row border-2 border-gray-700">
        {/* Left side - To Address */}
        <div className="border-r-2 border-gray-700 p-2 flex-1">
          <div className="font-semibold">To,</div>
          <div>M/s {recipient.name}</div>
          {recipient.address.map((line, index) => (
            <div key={index} className="border-b border-gray-400 my-1">
              {line}
            </div>
          ))}
          {/* Add empty lines for manual filling if needed */}
          {recipient.address.length < 3 &&
            Array(3 - recipient.address.length)
              .fill(0)
              .map((_, i) => (
                <div key={`empty-${i}`} className="border-b border-gray-400 my-1">
                  &nbsp;
                </div>
              ))}
        </div>

        {/* Right side - Bill No and Date */}
        <div className="p-2 w-full md:w-64">
          <div className="flex justify-between">
            <div className="font-semibold">Bill No.:</div>
            <div>{billNo}</div>
          </div>
          <div className="font-semibold">{location}</div>
          <div className="flex justify-between mt-4">
            <div className="font-semibold">Date:</div>
            <div className="border-b border-gray-400 flex-1 ml-2">{date}</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border-x-2 border-gray-700">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-y-2 border-gray-700">
              <th className="border-r-2 border-gray-700 p-1 text-sm w-10">Sr.</th>
              <th className="border-r-2 border-gray-700 p-1 text-sm w-20">L.R. No.</th>
              <th className="border-r-2 border-gray-700 p-1 text-sm" colSpan={2}>
                <div className="text-center">Particulars of Goods Transported</div>
                <div className="flex">
                  <div className="flex-1 text-center">From</div>
                  <div className="flex-1 text-center">To</div>
                </div>
              </th>
              <th className="border-r-2 border-gray-700 p-1 text-sm w-20">Inv. No.</th>
              <th className="border-r-2 border-gray-700 p-1 text-sm w-16">Rate</th>
              <th className="border-r-2 border-gray-700 p-1 text-sm w-16">Other Charges</th>
              <th className="p-1 text-sm w-24">Freight Amt.</th>
            </tr>
          </thead>
          <tbody>
            {goodsDetails.map((item, index) => (
              <tr key={index} className="border-b border-gray-700">
                <td className="border-r-2 border-gray-700 p-1 text-center">{item.sr}</td>
                <td className="border-r-2 border-gray-700 p-1">{item.lrNo}</td>
                <td className="border-r border-gray-400 p-1">{item.from}</td>
                <td className="border-r-2 border-gray-700 p-1">{item.to}</td>
                <td className="border-r-2 border-gray-700 p-1">{item.invNo}</td>
                <td className="border-r-2 border-gray-700 p-1 text-right">{item.rate.toFixed(2)}</td>
                <td className="border-r-2 border-gray-700 p-1 text-right">{item.otherCharges.toFixed(2)}</td>
                <td className="p-1 text-right">{item.freightAmt.toFixed(2)}</td>
              </tr>
            ))}
            {/* Empty rows for manual filling */}
            {goodsDetails.length < 10 &&
              Array(10 - goodsDetails.length)
                .fill(0)
                .map((_, i) => (
                  <tr key={`empty-row-${i}`} className="border-b border-gray-700 h-8">
                    <td className="border-r-2 border-gray-700"></td>
                    <td className="border-r-2 border-gray-700"></td>
                    <td className="border-r border-gray-400"></td>
                    <td className="border-r-2 border-gray-700"></td>
                    <td className="border-r-2 border-gray-700"></td>
                    <td className="border-r-2 border-gray-700"></td>
                    <td className="border-r-2 border-gray-700"></td>
                    <td></td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Total Amount */}
      <div className="flex border-x-2 border-b-2 border-gray-700">
        <div className="flex-1 p-2 border-r-2 border-gray-700">
          <div className="flex">
            <div className="font-semibold">Amount Rs.</div>
            <div className="border-b border-gray-400 flex-1 ml-2"></div>
          </div>
        </div>
        <div className="w-24 p-2">
          <div className="font-semibold">TOTAL</div>
          <div className="text-right font-bold">{totalAmount.toFixed(2)}</div>
        </div>
      </div>

      {/* Remark */}
      <div className="border-x-2 border-b-2 border-gray-700 p-2">
        <div className="flex">
          <div className="font-semibold">Remark:</div>
          <div className="border-b border-gray-400 flex-1 ml-2">{remark}</div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex text-sm mt-1">
        <div className="flex-1">
          <div>PAN No. {panNo}</div>
          <div>GSTIN: {gstin}</div>
        </div>
        <div className="w-48">
          <div className="border-2 border-gray-700 grid grid-cols-2">
            <div className="border-r border-b border-gray-700 p-1 text-center">Service Tax</div>
            <div className="border-b border-gray-700 p-1 text-center">Consignor</div>
            <div className="border-r border-gray-700 p-1 text-center">Payable by</div>
            <div className="p-1 text-center">Consignee</div>
          </div>
        </div>
        <div className="flex-1 text-right">
          <div>E. & O. E.</div>
          <div className="mt-4">For Shree Dattaguru Road Lines</div>
        </div>
      </div>
    </Card>
  )
}
const freightData = {
    companyName: "Shree Dattaguru Road Lines",
    companyTagline: "Transport Contractors & Fleet Owners",
    companyAddress: "Plot No. W - 4, Camlin Naka, MIDC, Tarapur.",
    contactNumbers: ["9823364283", "9168027869", "7276272828"],
    serviceDetails: [
      "Daily Part Load Service to -",
      "Tarapur, Bhiwandi, Palghar,",
      "Vashi, Taloja, Kolgoan Genises",
      "& Full Load to all over India",
    ],
    billNo: "TPR - 8482",
    location: "TARAPUR",
    date: "30/05/2025",
    recipient: {
      name: "ABC Industries Ltd.",
      address: ["123 Manufacturing Zone", "Industrial Area, Mumbai - 400001"],
    },
    goodsDetails: [
      {
        sr: 1,
        lrNo: "LR12345",
        from: "Mumbai",
        to: "Tarapur",
        invNo: "INV-001",
        rate: 1500,
        otherCharges: 200,
        freightAmt: 1700,
      },
      {
        sr: 2,
        lrNo: "LR12346",
        from: "Pune",
        to: "Bhiwandi",
        invNo: "INV-002",
        rate: 2000,
        otherCharges: 300,
        freightAmt: 2300,
      },
    ],
    totalAmount: 4000,
    remark: "Goods delivered in good condition",
    panNo: "AGTPV0112D",
    gstin: "27AGTPV0112D1ZG",
    serviceTaxPayableBy: "Consignor",
  }