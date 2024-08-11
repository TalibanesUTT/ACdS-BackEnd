CREATE PROCEDURE GetAccountingBalance(
    IN p_Year INT,
    IN p_Month INT
)
BEGIN 
    DECLARE v_TotalIncomes DECIMAL(10,2);
    DECLARE v_TotalExpenditure DECIMAL(10,2);
    DECLARE v_Profit DECIMAL(10,2);
    DECLARE v_AverageIncomePerDay DECIMAL(10,2);
    DECLARE v_AverageIncomePerMonth DECIMAL(10,2);
    DECLARE v_AverageExpenditurePerDay DECIMAL(10,2);
    DECLARE v_AverageExpenditurePerMonth DECIMAL(10,2);
    DECLARE v_DaysInRange INT;
    DECLARE v_MonthsInRange INT;

    CALL GetTotalIncome(p_Year, p_Month, v_TotalIncomes);
    CALL GetTotalExpenditure(p_Year, p_Month, v_TotalExpenditure);

    SET v_Profit = v_TotalIncomes - v_TotalExpenditure;

    IF p_Month IS NOT NULL THEN
        SET v_DaysInRange = DAY(LAST_DAY(CONCAT(p_Year, '-', p_Month, '-01')));
        SET v_MonthsInRange = 1;
    ELSE
        SET v_DaysInRange = IF(
            (p_Year % 4 = 0 AND (p_Year % 100 != 0 OR p_Year % 400 = 0)), 366, 365
        );
        SET v_MonthsInRange = 12;
    END IF; 

    SET v_AverageIncomePerDay = v_TotalIncomes / v_DaysInRange;
    SET v_AverageIncomePerMonth = v_TotalIncomes / v_MonthsInRange;
    SET v_AverageExpenditurePerDay = v_TotalExpenditure / v_DaysInRange;
    SET v_AverageExpenditurePerMonth = v_TotalExpenditure / v_MonthsInRange;

    SELECT
        v_TotalIncomes AS TotalIncomes,
        v_TotalExpenditure AS TotalExpenditure,
        v_Profit AS Profit,
        v_AverageIncomePerDay AS AverageIncomePerDay,
        v_AverageIncomePerMonth AS AverageIncomePerMonth,
        v_AverageExpenditurePerDay AS AverageExpenditurePerDay,
        v_AverageExpenditurePerMonth AS AverageExpenditurePerMonth;
END