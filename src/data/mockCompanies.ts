import { CompanyProfile } from '../types/finance';

export const MOCK_COMPANIES: CompanyProfile[] = [
  {
    id: 'comp_saas_01',
    name: '⚡ HyperScale AI Technologies Pvt Ltd',
    industry: 'SaaS',
    legalEntity: 'HyperScale AI Technologies India Private Limited',
    gstin: '29AABCH9912E1Z8',
    pan: 'AABCH9912E',
    razorpayMid: 'rzp_live_hyperscale_ai',
    totalCashINR: 42500000, // ₹4.25 Cr
    monthlyBurnINR: 3200000, // ₹32 Lakhs
    monthlyRevenueINR: 5800000, // ₹58 Lakhs
    runwayMonths: 16.3,
    primaryBank: {
      bankName: 'ICICI Bank (Current A/c)',
      accountNumber: '99281048201',
      ifsc: 'ICIC0000002',
      currentBalanceINR: 28500000, // ₹2.85 Cr
    },
    razorpayXBalanceINR: 14000000, // ₹1.40 Cr
  },
  {
    id: 'comp_d2c_02',
    name: '🛍️ UrbanAura Lifestyle D2C',
    industry: 'D2C E-Commerce',
    legalEntity: 'UrbanAura Retail & Apparels Private Limited',
    gstin: '27AABCU4419K1ZM',
    pan: 'AABCU4419K',
    razorpayMid: 'rzp_live_urbanaura_retail',
    totalCashINR: 21000000, // ₹2.10 Cr
    monthlyBurnINR: 4800000, // ₹48 Lakhs
    monthlyRevenueINR: 8200000, // ₹82 Lakhs
    runwayMonths: 6.2,
    primaryBank: {
      bankName: 'HDFC Bank (Current A/c)',
      accountNumber: '50200049281033',
      ifsc: 'HDFC0000120',
      currentBalanceINR: 12500000, // ₹1.25 Cr
    },
    razorpayXBalanceINR: 8500000, // ₹85 Lakhs
  },
  {
    id: 'comp_logistics_03',
    name: '🚚 FleetLogix Freight Solutions',
    industry: 'B2B Logistics',
    legalEntity: 'FleetLogix Supply Chain Solutions Pvt Ltd',
    gstin: '07AABCF6281P1ZQ',
    pan: 'AABCF6281P',
    razorpayMid: 'rzp_live_fleetlogix_corp',
    totalCashINR: 68000000, // ₹6.80 Cr
    monthlyBurnINR: 5500000, // ₹55 Lakhs
    monthlyRevenueINR: 11200000, // ₹1.12 Cr
    runwayMonths: 12.0,
    primaryBank: {
      bankName: 'Axis Bank (Corporate A/c)',
      accountNumber: '918020048192019',
      ifsc: 'UTIB0000042',
      currentBalanceINR: 49000000, // ₹4.90 Cr
    },
    razorpayXBalanceINR: 19000000, // ₹1.90 Cr
  },
];
