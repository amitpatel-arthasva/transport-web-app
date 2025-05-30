import React from 'react';

const ShreeDattaguruLR = () => {
  const data = {
    consignor: "ABC Pvt Ltd",
    consignee: "XYZ Traders",
    cnNo: "TPR-12345",
    date: "2025-05-29",
    truckNo: "MH12AB1234",
    from: "TARAPUR",
    to: "BHIWANDI",
    particulars: [
      { nos: "1", detail: "Steel Rods", rate: "1500", weight: "800" },
      { nos: "2", detail: "Cement Bags", rate: "1000", weight: "400" }
    ],
    charges: {
      freight: 1500,
      hamali: 200,
      aoc: 100,
      doorDelivery: 50,
      collection: 0,
      stCharge: 20,
      extraLoading: 0,
      total: 1870
    },
    paymentStatus: "To Pay", // Options: "Paid", "To Be Bill", "To Pay"
    weight: {
      actual: "1200",
      unit: "Kg"
    },
    invNo: "",
    chNo: "",
    serviceTaxPayable: "Consignee", // Options: "Consignor", "Consignee"
    deliveryAt: "Construction Site, Palghar",
    remarks: "Handle with care",
    gstin: "27AGTPV0112D1ZG",
    pan: "AGTPV0112D"
  };

  return (
    <table className="max-w-6xl mx-auto p-4 bg-white w-full border-collapse border-2 border-black">
      {/* Header Section */}
      <thead>
        <tr>
          <td colSpan="2" className="border-b-2 border-black">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="w-24 h-16 p-4">
                    {/* Logo placeholder */}
                    <svg viewBox="0 0 100 80" className="w-full h-full">
                      <rect x="20" y="45" width="75" height="25" fill="#666" />
                      <rect x="5" y="55" width="35" height="15" fill="#666" />
                      <circle cx="25" cy="70" r="8" fill="#333" stroke="#222" />
                      <circle cx="70" cy="70" r="8" fill="#333" stroke="#222" />
                      <rect x="75" y="50" width="15" height="15" fill="#666" />
                      <rect x="10" y="30" width="15" height="25" rx="2" fill="#666" />
                    </svg>
                  </td>
                  <td className="flex-1 text-center p-4">
                    {/* Company Name */}
                    <div className="text-2xl font-bold mb-1">श्री दत्तगुरु रोड लाईन्स</div>
                    <div className="text-xl font-bold mb-1">SHREE DATTAGURU ROAD LINES</div>
                    <div className="text-sm">Transport Contractors & Fleet Owners</div>
                  </td>
                  <td className="text-right text-xs p-4">
                    {/* Right side info */}
                    <div className="font-bold">SUBJECT TO PALGHAR JURISDICTION</div>
                    <div>Daily Part Load Service to -</div>
                    <div>Tarapur, Bhiwandi, Palghar,</div>
                    <div>Vashi, Taloja, Kolgoan Genises</div>
                    <div className="font-bold mt-2">Consignor Copy</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </thead>

      {/* Main Content */}
      <tbody>
        <tr>
          {/* Left Section */}
          <td className="w-1/3 border-r-2 border-black align-top">
            <table className="w-full">              
				<tbody>                {/* Consignor/Consignee Info */}
                <tr>
                  <td className="border-b border-black p-2" style={{ height: '60px' }}>
                    <span className="font-bold">Consignor - </span>
                    M/s {data.consignor}
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-black p-2" style={{ height: '60px' }}>
                    <span className="font-bold">Consignee - </span>
                    M/s {data.consignee}
                  </td>
                </tr>

                {/* Location Details */}
                <tr>
                  <td className="border-b border-black p-2">
                    <div className="font-bold text-sm mb-2">TARAPUR</div>
                    <div className="text-xs">
                      <div>Plot No. W-4,</div>
                      <div>Camlin Naka,</div>
                      <div>MIDC, Tarapur.</div>
                      <div>M.: 9823364283/</div>
                      <div>9168027889/</div>
                      <div>7276272828</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-black p-2">
                    <div className="font-bold text-sm mb-2">BHIWANDI</div>
                    <div className="text-xs">
                      <div>Godown No. A-2,</div>
                      <div>Gali No. 2,</div>
                      <div>Opp. Capital Roadlines,</div>
                      <div>Khandegale Estate,</div>
                      <div>Purna Village, Bhiwandi.</div>
                      <div>M.: 7507844317/</div>
                      <div>9168027889</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-black p-2 text-xs">
                    <span className="font-bold">PAN :</span> {data.pan}
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-black p-2 text-xs">
                    <span className="font-bold">GSTIN :</span> {data.gstin}
                  </td>
                </tr>
                {/* Invoice & Challan Info */}
                <tr>
                  <td className="border-b border-black p-2 text-xs">
                    <table className="w-full">
                        <tbody>
                            <tr>
                                <td><span className="font-bold">Inv. No.:</span> {data.invNo}</td>
                                <td className="text-right"><span className="font-bold">Ch. No.:</span> {data.chNo}</td>
                            </tr>
                        </tbody>
                    </table>
                  </td>
                </tr>
                {/* Delivery At */}
                <tr>
                  <td className="border-b border-black p-2">
                    <div className="font-bold text-sm">Delivery At</div>
                    <div className="text-xs mt-1">{data.deliveryAt}</div>
                  </td>
                </tr>
                {/* Remarks */}
                <tr>
                  <td className="p-2">
                    <div className="font-bold text-sm">Remarks</div>
                    <div className="text-xs mt-1">{data.remarks}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>

          {/* Right Section */}
          <td className="flex-1 align-top">
            <table className="w-full">
              <tbody>                {/* Top Info Row */}
                <tr>
                  <td className="border-b border-black" style={{ height: '30px' }}>
                    <table className="w-full h-full">
                        <tbody>
                            <tr>
                                <td className="flex-1 border-r border-black p-2">
                                    <span className="font-bold">CN't No. - TPR - </span>
                                    <span>{data.cnNo}</span>
                                </td>
                                <td className="w-32 p-1 row-span-4 text-sm">
                                    <span className="font-bold">Truck No.: </span>
                                    <div>{data.truckNo}</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-black" style={{ height: '30px' }}>
                     <table className="w-full h-full">
                        <tbody>
                            <tr>
                                <td className="flex-1 border-r border-black p-2">
                                    <span className="font-bold">Date - </span>
                                    <span>{data.date}</span>
                                </td>
                                <td className="w-32 p-2"></td> {/* Kept for structure, was empty div */}
                            </tr>
                        </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-black" style={{ height: '30px' }}>
                    <table className="w-full h-full">
                        <tbody>
                            <tr>
                                <td className="flex-1 border-r border-black p-2">
                                    <span className="font-bold">From - </span>
                                    <span>{data.from}</span>
                                </td>
                                <td className="w-32 p-2"></td> {/* Kept for structure, was empty div */}
                            </tr>
                        </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-black" style={{ height: '30px' }}>
                    <table className="w-full h-full">
                        <tbody>
                            <tr>
                                <td className="flex-1 border-r border-black p-2">
                                    <span className="font-bold">To - </span>
                                    <span>{data.to}</span>
                                </td>
                                <td className="w-32 p-2"></td> {/* Kept for structure, was empty div */}
                            </tr>
                        </tbody>
                    </table>
                  </td>
                </tr>
                {/* Main Table (already a table, so it's integrated here) */}                <tr>
                  <td className="h-full">
                    <div className="flex h-full">
                      {/* Table 1: Particulars */}
                      <div className="w-3/5">
                        <table className="w-full border-collapse text-sm h-full">
                          <thead>
                            <tr>
                              <th className="border border-black p-2 w-16">Nos.</th>
                              <th className="border border-black p-2">Particulars</th>
                            </tr>
                          </thead>
                          <tbody className="h-full">
                            {data.particulars.map((item, index) => (
                              <tr key={index}>
                                <td className="border border-black p-2 text-center">{item.nos}</td>
                                <td className="border border-black p-2 whitespace-normal">{item.detail}</td>
                              </tr>
                            ))}
                            <tr>
                              <td className="border border-black p-1"></td>
                              <td className="border border-black p-1 text-xs">
                                <span>Service Tax Payable by:</span>
                                <div className="flex mt-1 space-x-4">
                                  <div className="flex items-center">
                                    <div className="border border-black w-3 h-3 mr-1 inline-block align-middle">
                                      {data.serviceTaxPayable === "Consignor" && "✓"}
                                    </div>
                                    <span className="text-xs align-middle">Consignor</span>
                                  </div>
                                  <div className="flex items-center">
                                    <div className="border border-black w-3 h-3 mr-1 inline-block align-middle">
                                      {data.serviceTaxPayable === "Consignee" && "✓"}
                                    </div>
                                    <span className="text-xs align-middle">Consignee</span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td className="border border-black p-1"></td>
                              <td className="border border-black p-1 text-xs">
                                <div><span className="font-bold">Inv. No.:</span> {data.invNo}</div>
                                <div><span className="font-bold">Ch. No.:</span> {data.chNo}</div>
                              </td>
                            </tr>
                            {/* Flexible spacer row that will expand to fill available space */}
                            <tr className="h-full">
                              <td className="border-l border-r border-black"></td>
                              <td className="border-l border-r border-black"></td>
                            </tr>
                            {/* Bottom border for the last row */}
                            <tr>
                              <td className="border-l border-r border-b border-black p-1"></td>
                              <td className="border-l border-r border-b border-black p-1"></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Table 2: Rate Rs. */}
                      <div className="w-1/4">
                        <table className="w-full border-collapse text-sm h-full">
                          <thead>
                            <tr>
                              <th className="border border-black p-2" colSpan="2">Rate Rs.</th>
                            </tr>
                            <tr>
                              <th className="border border-black p-1 w-2/3">Description</th>
                              <th className="border border-black p-1 w-1/3">Amount</th>
                            </tr>
                          </thead>
                          <tbody className="h-full">
                            <tr>
                              <td className="border border-black p-1">Freight</td>
                              <td className="border border-black p-1 text-center">{data.charges.freight}</td>
                            </tr>
                            <tr>
                              <td className="border border-black p-1">Hamali</td>
                              <td className="border border-black p-1 text-center">{data.charges.hamali}</td>
                            </tr>
                            <tr>
                              <td className="border border-black p-1">A. O. C.</td>
                              <td className="border border-black p-1 text-center">{data.charges.aoc}</td>
                            </tr>
                            <tr>
                              <td className="border border-black p-1">Door Dely.</td>
                              <td className="border border-black p-1 text-center">{data.charges.doorDelivery}</td>
                            </tr>
                            <tr>
                              <td className="border border-black p-1">Collection</td>
                              <td className="border border-black p-1 text-center">{data.charges.collection}</td>
                            </tr>
                            <tr>
                              <td className="border border-black p-1">St. Charge</td>
                              <td className="border border-black p-1 text-center">{data.charges.stCharge}</td>
                            </tr>
                            <tr>
                              <td className="border border-black p-1">
                                Extra Loading
                                <br />
                                Paid by us
                              </td>
                              <td className="border border-black p-1 text-center">{data.charges.extraLoading}</td>
                            </tr>
                            {/* Flexible spacer row that will expand to fill available space */}
                            <tr className="h-full">
                              <td className="border-l border-r border-black"></td>
                              <td className="border-l border-r border-black"></td>
                            </tr>
                            {/* Total row with bottom border */}
                            <tr>
                              <td className="border border-black p-1 font-bold">Total</td>
                              <td className="border border-black p-1 text-center font-bold">{data.charges.total}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Table 3: Weight */}
                      <div className="w-1/6">
                        <table className="w-full border-collapse text-sm h-full">
                          <thead>
                            <tr>
                              <th className="border border-black p-2">Weight</th>
                            </tr>
                            <tr>
                              <th className="border border-black p-1">
                                <div className="flex">
                                  <div className="flex-1 border-r border-black text-center">Actual</div>
                                  <div className="flex-1 text-center">Kg.</div>
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="h-full">
                            <tr>
                              <td className="border border-black p-1 text-center">{data.weight.actual}</td>
                            </tr>
                            <tr>
                              <td className={`border border-black p-1 text-center ${data.paymentStatus === "Paid" ? "font-bold" : ""}`}>Paid</td>
                            </tr>
                            <tr>
                              <td className={`border border-black p-1 text-center ${data.paymentStatus === "To Be Bill" ? "font-bold" : ""}`}>To Be Bill</td>
                            </tr>
                            <tr>
                              <td className={`border border-black p-1 text-center ${data.paymentStatus === "To Pay" ? "font-bold" : ""}`}>To Pay</td>
                            </tr>
                            <tr>
                              <td className="border border-black p-1 text-center">
                                Goods entirely
                                <br />
                                booked at
                                <br />
                                <span className="font-bold">OWNER'S RISK</span>
                              </td>
                            </tr>
                            {/* Flexible spacer row that will expand to fill available space */}
                            <tr className="h-full">
                              <td className="border-l border-r border-black"></td>
                            </tr>
                            {/* Bottom border for the last row */}
                            <tr>
                              <td className="border-l border-r border-b border-black"></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>

      {/* Footer */}
      <tfoot>
        <tr>
          <td colSpan="2" className="border-t-2 border-black">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="flex-1 border-r border-black p-2 text-xs">
                    We are not responsible for any type of damages, Leakage, Fire & Shortages. Kindly{" "}
                    <span className="font-bold">Insured by Consignor or Consignee</span>
                  </td>
                  <td className="w-48 p-2 text-center font-bold text-xs">For Shree Dattaguru Road Lines</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tfoot>
    </table>
  );
};

export default ShreeDattaguruLR;
