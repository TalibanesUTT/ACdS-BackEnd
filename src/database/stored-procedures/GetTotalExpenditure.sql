CREATE PROCEDURE GetTotalExpenditure(
	IN p_Year INT,
    IN p_Month INT,
    OUT v_TotalExpenditure DECIMAL(10,2)
)
BEGIN
    SELECT
        SUM(
            COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.spareParts')) AS DECIMAL(10,2)), 0) +
            COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.payroll')) AS DECIMAL(10,2)), 0) +
            COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.cleaning')) AS DECIMAL(10,2)), 0) +
            COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.water')) AS DECIMAL(10,2)), 0) +
            COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.electricity')) AS DECIMAL(10,2)), 0) +
            COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.radios')) AS DECIMAL(10,2)), 0) +
            COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.pettyCash')) AS DECIMAL(10,2)), 0) +
            COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.vacation')) AS DECIMAL(10,2)), 0) +
            COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.insurancePolicies')) AS DECIMAL(10,2)), 0) +
            COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.christmasBonusFund')) AS DECIMAL(10,2)), 0) +
            COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.vehicleRepairService')) AS DECIMAL(10,2)), 0) +
            COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.workshopMaintenance')) AS DECIMAL(10,2)), 0) +
            COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.officeEquipment')) AS DECIMAL(10,2)), 0) +
            COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.administrativeServices')) AS DECIMAL(10,2)), 0) +
            COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.taxPayments')) AS DECIMAL(10,2)), 0) +
            COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.workshopRents')) AS DECIMAL(10,2)), 0) +
            COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.sponsorshipAdvertising')) AS DECIMAL(10,2)), 0) +
            COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.workshopMaterialsTools')) AS DECIMAL(10,2)), 0) +
            COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.gasolineVouchers')) AS DECIMAL(10,2)), 0) +
            COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.settlement')) AS DECIMAL(10,2)), 0) +
            COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.uniforms')) AS DECIMAL(10,2)), 0) +
            COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(data, '$.others')) AS DECIMAL(10,2)), 0)
        ) INTO v_TotalExpenditure   
    FROM
        Expenditures e
    WHERE
        e.year = p_Year AND 
        (p_Month IS NULL OR e.month = p_Month);
END
