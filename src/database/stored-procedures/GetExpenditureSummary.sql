CREATE PROCEDURE GetExpenditureSummary(
    IN p_Year INT,
    IN p_Month INT
)

BEGIN
    DECLARE v_DaysInRange INT;
    DECLARE v_MonthsInRange INT;
    DECLARE v_TotalExpenditure DECIMAL(10,2);

    CALL GetTotalExpenditure(p_Year, p_Month, v_TotalExpenditure);

    IF p_Month IS NOT NULL THEN
        SET v_DaysInRange = DAY(LAST_DAY(CONCAT(p_Year, '-', p_Month, '-01')));
        SET v_MonthsInRange = 1;

        SELECT 
            CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.spareParts')) AS DECIMAL(10,2)) AS TotalSpareParts,
            CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.payroll')) AS DECIMAL(10,2)) AS TotalPayroll,
            CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.cleaning')) AS DECIMAL(10,2)) AS TotalCleaning,
            CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.water')) AS DECIMAL(10,2)) AS TotalWater,
            CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.electricity')) AS DECIMAL(10,2)) AS TotalElectricity,
            CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.radios')) AS DECIMAL(10,2)) AS TotalRadios,
            CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.pettyCash')) AS DECIMAL(10,2)) AS TotalPettyCash,
            CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.vacation')) AS DECIMAL(10,2)) AS TotalVacation,
            CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.insurancePolicies')) AS DECIMAL(10,2)) AS TotalInsurancePolicies,
            CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.christmasBonusFund')) AS DECIMAL(10,2)) AS TotalChristmasBonusFund,
            CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.vehicleRepairService')) AS DECIMAL(10,2)) AS TotalVehicleRepairService,
            CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.workshopMaintenance')) AS DECIMAL(10,2)) AS TotalWorkshopMaintenance,
            CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.officeEquipment')) AS DECIMAL(10,2)) AS TotalOfficeEquipment,
            CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.administrativeServices')) AS DECIMAL(10,2)) AS TotalAdministrativeServices,
            CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.taxPayments')) AS DECIMAL(10,2)) AS TotalTaxPayments,
            CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.workshopRents')) AS DECIMAL(10,2)) AS TotalWorkshopRents,
            CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.sponsorshipAdvertising')) AS DECIMAL(10,2)) AS TotalSponsorshipAdvertising,
            CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.workshopMaterialsTools')) AS DECIMAL(10,2)) AS TotalWorkshopMaterialsTools,
            CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.gasolineVouchers')) AS DECIMAL(10,2)) AS TotalGasolineVouchers,
            CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.settlement')) AS DECIMAL(10,2)) AS TotalSettlement,
            CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.uniforms')) AS DECIMAL(10,2)) AS TotalUniforms,
            CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.others')) AS DECIMAL(10,2)) AS TotalOthers,
            v_TotalExpenditure AS TotalExpenditure,
            v_TotalExpenditure / v_DaysInRange AS AverageExpenditurePerDay,
            v_TotalExpenditure / v_MonthsInRange AS AverageExpenditurePerMonth
        FROM 
            Expenditures e
        WHERE
            e.year = p_Year AND
            e.month = p_Month;

    ELSE
        SET v_DaysInRange = IF(
            (p_Year % 4 = 0 AND (p_Year % 100 != 0 OR p_Year % 400 = 0)), 366, 365
        );
        SET v_MonthsInRange = 12;

        SELECT
            SUM(COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.spareParts')) AS DECIMAL(10,2)), 0)) AS TotalSpareParts,
            SUM(COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.payroll')) AS DECIMAL(10,2)), 0)) AS TotalPayroll,
            SUM(COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.cleaning')) AS DECIMAL(10,2)), 0)) AS TotalCleaning,
            SUM(COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.water')) AS DECIMAL(10,2)), 0)) AS TotalWater,
            SUM(COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.electricity')) AS DECIMAL(10,2)), 0)) AS TotalElectricity,
            SUM(COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.radios')) AS DECIMAL(10,2)), 0)) AS TotalRadios,
            SUM(COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.pettyCash')) AS DECIMAL(10,2)), 0)) AS TotalPettyCash,
            SUM(COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.vacation')) AS DECIMAL(10,2)), 0)) AS TotalVacation,
            SUM(COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.insurancePolicies')) AS DECIMAL(10,2)), 0)) AS TotalInsurancePolicies,
            SUM(COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.christmasBonusFund')) AS DECIMAL(10,2)), 0)) AS TotalChristmasBonusFund,
            SUM(COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.vehicleRepairService')) AS DECIMAL(10,2)), 0)) AS TotalVehicleRepairService,
            SUM(COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.workshopMaintenance')) AS DECIMAL(10,2)), 0)) AS TotalWorkshopMaintenance,
            SUM(COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.officeEquipment')) AS DECIMAL(10,2)), 0)) AS TotalOfficeEquipment,
            SUM(COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.administrativeServices')) AS DECIMAL(10,2)), 0)) AS TotalAdministrativeServices,
            SUM(COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.taxPayments')) AS DECIMAL(10,2)), 0)) AS TotalTaxPayments,
            SUM(COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.workshopRents')) AS DECIMAL(10,2)), 0)) AS TotalWorkshopRents,
            SUM(COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.sponsorshipAdvertising')) AS DECIMAL(10,2)), 0)) AS TotalSponsorshipAdvertising,
            SUM(COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.workshopMaterialsTools')) AS DECIMAL(10,2)), 0)) AS TotalWorkshopMaterialsTools,
            SUM(COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.gasolineVouchers')) AS DECIMAL(10,2)), 0)) AS TotalGasolineVouchers,
            SUM(COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.settlement')) AS DECIMAL(10,2)), 0)) AS TotalSettlement,
            SUM(COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.uniforms')) AS DECIMAL(10,2)), 0)) AS TotalUniforms,
            SUM(COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.others')) AS DECIMAL(10,2)), 0)) AS TotalOthers,
            v_TotalExpenditure AS TotalExpenditure,
            v_TotalExpenditure / v_DaysInRange AS AverageExpenditurePerDay,
            v_TotalExpenditure / v_MonthsInRange AS AverageExpenditurePerMonth
        FROM
            Expenditures e
        WHERE 
            e.year = p_Year;
    END IF;
END