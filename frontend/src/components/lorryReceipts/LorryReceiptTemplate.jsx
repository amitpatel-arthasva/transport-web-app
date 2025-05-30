import React from 'react';

const LorryReceiptTemplate = ({
  companyName = "श्री दत्तगुरु रोड लाईन्स\nShree Dattaguru Road Lines",
  companyTagline = "Transport Contractors & Fleet Owners",
  jurisdiction = "SUBJECT TO PALGHAR JURISDICTION",
  serviceAreas = ["Daily Part Load Service to -", "Tarapur, Bhiwandi, Palghar,", "Vashi, Taloja, Kolgoan Genises"],
  copyType = "Consignor Copy",
  consignor = { name: "", address: [""] },
  consignee = { name: "", address: [""] },
  cntNo = "TPR -",
  date = "",
  truckNo = "",
  from = "TARAPUR",
  to = "",
  goodsDetails = [],
  charges = {
    freight: 0,
    hamali: 0,
    aoc: 0,
    doorDelivery: 0,
    collection: 0,
    stCharge: 20,
    extraLoading: 0,
  },
  paymentStatus = {
    paid: 0,
    toBeBill: 0,
    toPay: 0,
  },
  serviceTaxPayableBy = "Consignor",
  invNo = "",
  chNo = "",
  total = 0,
  deliveryAt = "",
  remarks = "",
  tarapurAddress = [
    "Plot No. W-4,",
    "Camlin Naka,",
    "MIDC, Tarapur.",
    "M.: 9823364283/",
    "    9168027869/",
    "    7276272828",
  ],
  bhiwandiAddress = [
    "Godown No. A-2,",
    "Gali No. 2,",
    "Opp. Capital Roadlines,",
    "Khandagale Estate,",
    "Purna Village, Bhiwandi.",
    "M.: 7507844317/",
    "    9168027868",
  ],
  panNo = "AGTPV0112D",
  gstin = "27AGTPV0112D1ZG",
  disclaimer = "We are not responsible for any type of damages, Leakage, Fire & Shortages. Kindly Insured by Consignor or Consignee",
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 bg-white border-2 border-gray-800 print:border-0 print:shadow-none">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-gray-800 pb-2 mb-2">
        <div className="flex items-center gap-4">
          <div className="w-20 h-16 border border-gray-800 flex items-center justify-center">
            <span className="text-xs text-center">[Truck Logo]</span>
          </div>          <div>
            <h1 className="text-2xl font-bold whitespace-pre-line">{companyName}</h1>
            <div className="text-lg font-semibold border-b border-gray-800">{companyTagline}</div>
          </div>
        </div>
        <div className="text-right text-sm">
          <div className="font-semibold">{jurisdiction}</div>
          {serviceAreas.map((area, index) => (
            <div key={index}>{area}</div>
          ))}
          <div className="font-bold mt-1">{copyType}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Consignor/Consignee */}
        <div className="lg:col-span-1 space-y-4">
          {/* Consignor */}
          <div className="border-2 border-gray-800 p-2">
            <div className="font-semibold">Consignor - M/s</div>
            <div>{consignor.name}</div>
            {consignor.address.map((line, index) => (
              <div key={index} className="border-b border-gray-400 min-h-[20px]">
                {line}
              </div>
            ))}
          </div>

          {/* Consignee */}
          <div className="border-2 border-gray-800 p-2">
            <div className="font-semibold">Consignee - M/s</div>
            <div>{consignee.name}</div>
            {consignee.address.map((line, index) => (
              <div key={index} className="border-b border-gray-400 min-h-[20px]">
                {line}
              </div>
            ))}
          </div>

          {/* Office Addresses */}
          <div className="space-y-2 text-xs">
            <div className="border border-gray-800 p-2">
              <div className="font-bold">TARAPUR</div>
              {tarapurAddress.map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
            <div className="border border-gray-800 p-2">
              <div className="font-bold">BHIWANDI</div>
              {bhiwandiAddress.map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
          </div>

          {/* Tax Info */}
          <div className="text-xs space-y-1">
            <div>PAN : {panNo}</div>
            <div>GSTIN : {gstin}</div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* CN Details */}
          <div className="grid grid-cols-2 gap-2">
            <div className="border-2 border-gray-800 p-2">
              <div className="font-semibold">CN't No. - {cntNo}</div>
            </div>
            <div className="border-2 border-gray-800 p-2">
              <div className="font-semibold">Date - {date}</div>
              <div className="font-semibold">Truck No.: {truckNo}</div>
            </div>
            <div className="border-2 border-gray-800 p-2">
              <div className="font-semibold">From - {from}</div>
            </div>
            <div className="border-2 border-gray-800 p-2">
              <div className="font-semibold">To - {to}</div>
            </div>
          </div>

          {/* Main Table */}
          <div className="border-2 border-gray-800">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b-2 border-gray-800">
                  <th className="border-r-2 border-gray-800 p-1 w-16">Nos.</th>
                  <th className="border-r-2 border-gray-800 p-1">Particulars</th>
                  <th className="border-r-2 border-gray-800 p-1 w-20">Rate Rs.</th>
                  <th className="p-1 w-24">
                    <div>Weight</div>
                    <div className="flex">
                      <div className="flex-1">Actual</div>
                      <div className="flex-1">Kg.</div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {goodsDetails.map((item, index) => (
                  <tr key={index} className="border-b border-gray-800">
                    <td className="border-r-2 border-gray-800 p-1 text-center">{item.nos}</td>
                    <td className="border-r-2 border-gray-800 p-1">{item.particulars}</td>
                    <td className="border-r-2 border-gray-800 p-1 text-right">{item.rateRs}</td>
                    <td className="p-1 text-right">{item.actualWeight}</td>
                  </tr>
                ))}
                {/* Charge rows */}
                <tr className="border-b border-gray-800">
                  <td className="border-r-2 border-gray-800 p-1"></td>
                  <td className="border-r-2 border-gray-800 p-1">Freight</td>
                  <td className="border-r-2 border-gray-800 p-1 text-right">{charges.freight}</td>
                  <td className="p-1"></td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="border-r-2 border-gray-800 p-1"></td>
                  <td className="border-r-2 border-gray-800 p-1">Hamali</td>
                  <td className="border-r-2 border-gray-800 p-1 text-right">{charges.hamali}</td>
                  <td className="p-1 text-center">Chargeable</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="border-r-2 border-gray-800 p-1"></td>
                  <td className="border-r-2 border-gray-800 p-1">A. O. C.</td>
                  <td className="border-r-2 border-gray-800 p-1 text-right">{charges.aoc}</td>
                  <td className="p-1"></td>
                </tr>                <tr className="border-b border-gray-800">
                  <td className="border-r-2 border-gray-800 p-1"></td>
                  <td className="border-r-2 border-gray-800 p-1">Door Dely.</td>
                  <td className="border-r-2 border-gray-800 p-1 text-right">{charges.doorDelivery}</td>
                  <td className="p-1 text-center">Paid: ₹{paymentStatus.paid}</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="border-r-2 border-gray-800 p-1"></td>
                  <td className="border-r-2 border-gray-800 p-1">Collection</td>
                  <td className="border-r-2 border-gray-800 p-1 text-right">{charges.collection}</td>
                  <td className="p-1 text-center">To Be Bill: ₹{paymentStatus.toBeBill}</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="border-r-2 border-gray-800 p-1"></td>
                  <td className="border-r-2 border-gray-800 p-1">St. Charge</td>
                  <td className="border-r-2 border-gray-800 p-1 text-right">{charges.stCharge}</td>
                  <td className="p-1 text-center">To Pay: ₹{paymentStatus.toPay}</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="border-r-2 border-gray-800 p-1"></td>
                  <td className="border-r-2 border-gray-800 p-1">Extra Loading Paid by us</td>
                  <td className="border-r-2 border-gray-800 p-1 text-right">{charges.extraLoading}</td>
                  <td className="p-1 text-center">
                    <div>Goods entirely</div>
                    <div>booked at</div>
                    <div className="font-bold">OWNER'S RISK</div>
                  </td>
                </tr>
                <tr className="border-b-2 border-gray-800">
                  <td className="border-r-2 border-gray-800 p-1"></td>
                  <td className="border-r-2 border-gray-800 p-1 font-bold">Total</td>
                  <td className="border-r-2 border-gray-800 p-1 text-right font-bold">{total}</td>
                  <td className="p-1"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Service Tax and Invoice Details */}
          <div className="grid grid-cols-2 gap-2">            <div className="border-2 border-gray-800">
              <table className="w-full text-sm">
                <tbody>
                  <tr>
                    <td className="border-r border-b border-gray-800 p-1 text-center">Service Tax</td>
                    <td className="border-b border-gray-800 p-1 text-center">{serviceTaxPayableBy === "Consignor" ? "✓" : ""}</td>
                  </tr>
                  <tr>
                    <td className="border-r border-gray-800 p-1 text-center">Payable by</td>
                    <td className="p-1 text-center">{serviceTaxPayableBy === "Consignee" ? "✓" : ""}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="border-2 border-gray-800 p-2 text-sm">
              <div>Inv. No. {invNo}</div>
              <div>Ch. No. {chNo}</div>
            </div>
          </div>

          {/* Delivery and Remarks */}
          <div className="space-y-2">
            <div className="border-2 border-gray-800 p-2">
              <div className="font-semibold">Delivery At.</div>
              <div className="border-b border-gray-400 min-h-[20px]">{deliveryAt}</div>
            </div>
            <div className="border-2 border-gray-800 p-2">
              <div className="font-semibold">Remarks</div>
              <div className="border-b border-gray-400 min-h-[20px]">{remarks}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 border-t-2 border-gray-800 pt-2">
        <div className="flex justify-between text-xs">
          <div>{disclaimer}</div>
          <div className="font-bold">For श्री दत्तगुरु रोड लाईन्स<br/>Shree Dattaguru Road Lines</div>
        </div>
      </div>
    </div>
  );
};

export default LorryReceiptTemplate;
