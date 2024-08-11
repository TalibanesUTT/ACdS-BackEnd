CREATE PROCEDURE GetTotalIncome(
    IN p_Year INT,
    IN p_Month INT,
    OUT v_TotalIncomes DECIMAL(10,2)
)
BEGIN
    SELECT
        ROUND(SUM(sod.total_cost), 2) INTO v_TotalIncomes
    FROM
        ServiceOrdersDetails sod
    WHERE
        sod.total_cost IS NOT NULL AND
        YEAR(sod.departure_date) = p_Year AND
        (p_Month IS NULL OR MONTH(sod.departure_date) = p_Month);
END