import { ExpenditureData } from "@/app/interfaces/expenditure-data.interface";

export function validateAndTransformData(data: any): ExpenditureData {
    const defaultNumber = 0.00;

    return {
        spareParts: typeof data.spareParts === "number" && !isNaN(data.spareParts) ? parseFloat(data.spareParts.toFixed(2)) : defaultNumber,
        payroll: typeof data.payroll === "number" && !isNaN(data.payroll) ? parseFloat(data.payroll.toFixed(2)) : defaultNumber,
        cleaning: typeof data.cleaning === "number" && !isNaN(data.cleaning) ? parseFloat(data.cleaning.toFixed(2)) : defaultNumber,
        water: typeof data.water === "number" && !isNaN(data.water) ? parseFloat(data.water.toFixed(2)) : defaultNumber,
        electricity: typeof data.electricity === "number" && !isNaN(data.electricity) ? parseFloat(data.electricity.toFixed(2)) : defaultNumber,
        radios: typeof data.radios === "number" && !isNaN(data.radios) ? parseFloat(data.radios.toFixed(2)) : defaultNumber,
        telephones: typeof data.telephones === "number" && !isNaN(data.telephones) ? parseFloat(data.telephones.toFixed(2)) : defaultNumber,
        pettyCash: typeof data.pettyCash === "number" && !isNaN(data.pettyCash) ? parseFloat(data.pettyCash.toFixed(2)) : defaultNumber,
        vacation: typeof data.vacation === "number" && !isNaN(data.vacation) ? parseFloat(data.vacation.toFixed(2)) : defaultNumber,
        insurancePolicies: typeof data.insurancePolicies === "number" && !isNaN(data.insurancePolicies) ? parseFloat(data.insurancePolicies.toFixed(2)) : defaultNumber,
        christmasBonusFund: typeof data.christmasBonusFund === "number" && !isNaN(data.christmasBonusFund) ? parseFloat(data.christmasBonusFund.toFixed(2)) : defaultNumber,
        vehicleRepairService: typeof data.vehicleRepairService === "number" && !isNaN(data.vehicleRepairService) ? parseFloat(data.vehicleRepairService.toFixed(2)) : defaultNumber,
        workshopMaintenance: typeof data.workshopMaintenance === "number" && !isNaN(data.workshopMaintenance) ? parseFloat(data.workshopMaintenance.toFixed(2)) : defaultNumber,
        officeEquipment: typeof data.officeEquipment === "number" && !isNaN(data.officeEquipment) ? parseFloat(data.officeEquipment.toFixed(2)) : defaultNumber,
        administrativeServices: typeof data.administrativeServices === "number" && !isNaN(data.administrativeServices) ? parseFloat(data.administrativeServices.toFixed(2)) : defaultNumber,
        taxPayments: typeof data.taxPayments === "number" && !isNaN(data.taxPayments) ? parseFloat(data.taxPayments.toFixed(2)) : defaultNumber,
        workshopRents: typeof data.workshopRents === "number" && !isNaN(data.workshopRents) ? parseFloat(data.workshopRents.toFixed(2)) : defaultNumber,
        sponsorshipAdvertising: typeof data.sponsorshipAdvertising === "number" && !isNaN(data.sponsorshipAdvertising) ? parseFloat(data.sponsorshipAdvertising.toFixed(2)) : defaultNumber,
        workshopMaterialsTools: typeof data.workshopMaterialsTools === "number" && !isNaN(data.workshopMaterialsTools) ? parseFloat(data.workshopMaterialsTools.toFixed(2)) : defaultNumber,
        gasolineVouchers: typeof data.gasolineVouchers === "number" && !isNaN(data.gasolineVouchers) ? parseFloat(data.gasolineVouchers.toFixed(2)) : defaultNumber,
        settlement: typeof data.settlement === "number" && !isNaN(data.settlement) ? parseFloat(data.settlement.toFixed(2)) : defaultNumber,
        uniforms: typeof data.uniforms === "number" && !isNaN(data.uniforms) ? parseFloat(data.uniforms.toFixed(2)) : defaultNumber,
        others: typeof data.others === "number" && !isNaN(data.others) ? parseFloat(data.others.toFixed(2)) : defaultNumber,
    }
}