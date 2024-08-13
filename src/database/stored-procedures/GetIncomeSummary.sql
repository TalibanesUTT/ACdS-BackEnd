CREATE PROCEDURE GetIncomeSummary(
    IN p_StartDate DATE,
    IN p_EndDate DATE
)
BEGIN
    DECLARE v_DaysDiff INT;
    DECLARE v_MonthsDiff INT;

    SET p_EndDate = DATE_ADD(p_EndDate, INTERVAL 1 DAY);
    SET v_DaysDiff = DATEDIFF(p_EndDate, p_StartDate);

    SELECT
        so.file_number 'FileNumber',
        so.create_date 'Date',
        CONCAT(b.brand, ' ', m.model, ' ', v.year, ' ', v.color) 'Vehicle',
        sod.departure_date 'DepartureDate',
        sod.repair_days 'RepairDays',
        so.initial_mileage 'InitialMileage',
        sod.final_mileage 'FinalMileage',
        GROUP_CONCAT(s.service SEPARATOR ', ') 'Services',
        sod.budget 'Budget',
        sod.total_cost 'TotalCost'
    FROM
        ServiceOrders so
    INNER JOIN
        ServiceOrdersDetails sod ON so.id = sod.service_order_id
    LEFT JOIN
        ServicesOrderServices sos ON so.id = sos.service_order_id
    LEFT JOIN
        Services s ON sos.service_id = s.id
    LEFT JOIN
        Vehicles v ON so.vehicle_id = v.id
    LEFT JOIN
        CarModels m ON v.model_id = m.id
    LEFT JOIN
        CarBrands b ON m.brand_id = b.id
    WHERE
        sod.total_cost IS NOT NULL AND
        sod.departure_date BETWEEN p_StartDate AND p_EndDate
    GROUP BY
        so.file_number,
        so.create_date,
        b.brand,
        m.model,
        v.year,
        v.color,
        sod.departure_date,
        sod.repair_days,
        so.initial_mileage,
        sod.final_mileage,
        sod.budget,
        sod.total_cost;
    
    SELECT 
        ROUND(SUM(sod.total_cost), 2) AS TotalIncome
    FROM
        ServiceOrdersDetails sod
    WHERE
        sod.total_cost IS NOT NULL AND
        sod.departure_date BETWEEN p_StartDate AND p_EndDate;
    
    IF v_DaysDiff > 2 THEN
        SELECT 
            ROUND(SUM(sod.total_cost) / v_DaysDiff, 2) AS AverageIncomePerDay
        FROM
            ServiceOrdersDetails sod
        WHERE
            sod.total_cost IS NOT NULL AND
            sod.departure_date BETWEEN p_StartDate AND p_EndDate;
    END IF;

    IF v_DaysDiff > 32 THEN
        SELECT 
            ROUND(SUM(sod.total_cost) / 12, 2) AS AverageIncomePerMonth
        FROM
            ServiceOrdersDetails sod
        WHERE
            sod.total_cost IS NOT NULL AND
            sod.departure_date BETWEEN p_StartDate AND p_EndDate;
    END IF;

END