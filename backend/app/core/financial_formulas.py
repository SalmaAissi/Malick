def calculate_roi(net_profit, investment_cost):
    if investment_cost == 0:
        raise ValueError("Le coût d'investissement ne peut pas être zéro")
    return (net_profit / investment_cost) * 100


def calculate_profit_margin(revenue, cost_of_goods_sold):
    if revenue == 0:
        raise ValueError("Le chiffre d'affaires ne peut pas être zéro")
    net_profit = revenue - cost_of_goods_sold
    return (net_profit / revenue) * 100
