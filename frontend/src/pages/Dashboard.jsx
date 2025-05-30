import React from "react";
import FeatureCard from "../components/common/FeatureCard";
import Button from "../components/common/Button";
import { 
  faFileInvoice, 
  faTruck, 
  faReceipt, 
  faClipboardList, 
  faShippingFast,
  faCogs
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  
  const dashboardStats = {
    quotations: { total: 24, pending: 8, approved: 16 },
    lorryReceipts: { total: 18, processed: 15, pending: 3 },
    invoices: { total: 32, paid: 28, unpaid: 4 },
    loadingSlips: { total: 22, completed: 19, inProgress: 3 },
    deliverySlips: { total: 27, delivered: 24, pending: 3 },
    master: { trucks: 12, drivers: 8, customers: 45 }
  };

  const handleNavigate = (route) => {
    navigate(`/${route}`);
  };return (
    <div className="p-4 sm:p-6 text-primary-400">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-400 mb-2">
            Dashboard
          </h1>
          <p className="text-primary-400/70 text-lg">
            Welcome back! Here's an overview of your logistics operations.
          </p>
        </div>{/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center md:justify-items-stretch">            {/* Quotation Card */}
          <FeatureCard
            title="Quotations"
            icon={faFileInvoice}
            bgColor="bg-gradient-to-br from-primary-400 to-primary-300"
            iconBgColor="bg-primary-50"
            iconTextColor="text-[#47034b]"
          >
            <div className="space-y-3">
              <div className="bg-white/50 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm opacity-90">Total Quotations</span>
                  <span className="text-xl font-bold">{dashboardStats.quotations.total}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Pending: {dashboardStats.quotations.pending}</span>
                  <span>Approved: {dashboardStats.quotations.approved}</span>
                </div>
              </div>
                <Button
                text="View Quotations"
                onClick={() => handleNavigate('quotations')}
                bgColor="#FFF7F3"
                hoverBgColor="#FAD0C4"
                className="text-[#47034b] font-semibold"
                width="w-full"
                height="h-10"
              />
            </div>
          </FeatureCard>          {/* Lorry Receipt Card */}
          <FeatureCard
            title="Lorry Receipts"
            icon={faTruck}
            bgColor="bg-gradient-to-br from-primary-350 to-primary-200"
            iconBgColor="bg-primary-50"
            iconTextColor="text-[#47034b]"
          >
            <div className="space-y-3">
              <div className="bg-white/50 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm opacity-90">Total Receipts</span>
                  <span className="text-xl font-bold">{dashboardStats.lorryReceipts.total}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Processed: {dashboardStats.lorryReceipts.processed}</span>
                  <span>Pending: {dashboardStats.lorryReceipts.pending}</span>
                </div>
              </div>
                <Button
                text="View Receipts"
                onClick={() => handleNavigate('lorry-receipts')}
                bgColor="#FFF7F3"
                hoverBgColor="#FAD0C4"
                className="text-[#47034b] font-semibold"
                width="w-full"
                height="h-10"
              />
            </div>
          </FeatureCard>          {/* Invoice Card */}
          <FeatureCard
            title="Invoices"
            icon={faReceipt}
            bgColor="bg-gradient-to-br from-primary-300 to-primary-100"
            iconBgColor="bg-primary-50"
            iconTextColor="text-[#47034b]"
          >
            <div className="space-y-3">
              <div className="bg-white/50 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm opacity-90">Total Invoices</span>
                  <span className="text-xl font-bold">{dashboardStats.invoices.total}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Paid: {dashboardStats.invoices.paid}</span>
                  <span>Unpaid: {dashboardStats.invoices.unpaid}</span>
                </div>
              </div>
                <Button
                text="View Invoices"
                onClick={() => handleNavigate('invoices')}
                bgColor="#FFF7F3"
                hoverBgColor="#FAD0C4"
                className="text-[#47034b] font-semibold"
                width="w-full"
                height="h-10"
              />
            </div>
          </FeatureCard>          {/* Loading Slip Card */}
          <FeatureCard
            title="Loading Slips"
            icon={faClipboardList}
            bgColor="bg-gradient-to-br from-primary-100 to-primary-400"
            iconBgColor="bg-primary-50"
            iconTextColor="text-[#47034b]"
          >
            <div className="space-y-3">
              <div className="bg-white/50 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm opacity-90">Total Loading Slips</span>
                  <span className="text-xl font-bold">{dashboardStats.loadingSlips.total}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Completed: {dashboardStats.loadingSlips.completed}</span>
                  <span>In Progress: {dashboardStats.loadingSlips.inProgress}</span>
                </div>
              </div>
                <Button
                text="View Loading Slips"
                onClick={() => handleNavigate('loading-slips')}
                bgColor="#FFF7F3"
                hoverBgColor="#FAD0C4"
                className="text-[#47034b] font-semibold"
                width="w-full"
                height="h-10"
              />
            </div>
          </FeatureCard>          {/* Delivery Slip Card */}
          <FeatureCard
            title="Delivery Slips"
            icon={faShippingFast}
            bgColor="bg-gradient-to-br from-primary-350 to-primary-100"
            iconBgColor="bg-primary-50"
            iconTextColor="text-[#47034b]"
          >
            <div className="space-y-3">
              <div className="bg-white/50 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm opacity-90">Total Delivery Slips</span>
                  <span className="text-xl font-bold">{dashboardStats.deliverySlips.total}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Delivered: {dashboardStats.deliverySlips.delivered}</span>
                  <span>Pending: {dashboardStats.deliverySlips.pending}</span>
                </div>
              </div>
                <Button
                text="View Delivery Slips"
                onClick={() => handleNavigate('delivery-slips')}
                bgColor="#FFF7F3"
                hoverBgColor="#FAD0C4"
                className="text-[#47034b] font-semibold"
                width="w-full"
                height="h-10"
              />
            </div>
          </FeatureCard>          {/* Master Data Card */}
          <FeatureCard
            title="Master Data"
            icon={faCogs}
            bgColor="bg-gradient-to-br from-primary-200 to-primary-400"
            iconBgColor="bg-primary-50"
            iconTextColor="text-[#47034b]"
            className="md:col-span-2 lg:col-span-1"
          >
            <div className="space-y-3">
              {/* Master Data Stats */}
              <div className="bg-white/50 p-3 rounded-lg">
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <div className="font-bold text-lg">{dashboardStats.master.trucks}</div>
                    <div className="opacity-90">Trucks</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg">{dashboardStats.master.drivers}</div>
                    <div className="opacity-90">Drivers</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg">{dashboardStats.master.customers}</div>
                    <div className="opacity-90">Customers</div>
                  </div>
                </div>
              </div>

              {/* Master Data Actions */}
              <div className="space-y-2">                <Button
                  text="Manage Trucks"
                  onClick={() => handleNavigate('manage-trucks')}
                  bgColor="#FFF7F3"
                  hoverBgColor="#FAD0C4"
                  className="text-[#47034b] font-semibold text-sm"
                  width="w-full"
                  height="h-8"
                  icon={<span className="text-xs">🚛</span>}
                />
                
                <Button
                  text="Manage Drivers"
                  onClick={() => handleNavigate('manage-drivers')}
                  bgColor="#FFF7F3"
                  hoverBgColor="#FAD0C4"
                  className="text-[#47034b] font-semibold text-sm"
                  width="w-full"
                  height="h-8"
                  icon={<span className="text-xs">👨‍💼</span>}
                />
                
                <Button
                  text="Add Customer"
                  onClick={() => handleNavigate('add-customer')}
                  bgColor="#FFF7F3"
                  hoverBgColor="#FAD0C4"
                  className="text-[#47034b] font-semibold text-sm"
                  width="w-full"
                  height="h-8"
                  icon={<span className="text-xs">👥</span>}
                />
              </div>
            </div>
          </FeatureCard>

        </div>

        {/* Quick Actions Footer */}
        <div className="mt-8 bg-white/50 backdrop-blur-sm rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-[#C5677B] mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <Button
              text="New Quotation"
              onClick={() => handleNavigate('quotations')}
              bgColor="#C5677B"
              hoverBgColor="#C599B6"
              className="text-[#47034b] font-semibold"
              width="w-auto"
              icon={<span className="text-xl">📋</span>}
            />
            <Button
              text="Create Invoice"
              onClick={() => handleNavigate('invoices')}
              bgColor="#C599B6"
              hoverBgColor="#E6B2BA"
              className="text-[#47034b] font-semibold"
              width="w-auto"
              icon={<span className="text-xl">🧾</span>}
            />
            <Button
              text="Add Truck"
              onClick={() => handleNavigate('lorry-receipts')}
              bgColor="#E6B2BA"
              hoverBgColor="#FAD0C4"
              className="text-[#47034b] font-semibold"
              width="w-auto"
              icon={<span className="text-xl">🚛</span>}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
