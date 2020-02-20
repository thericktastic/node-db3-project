-- Multi-Table Query Practice

-- Display the ProductName and CategoryName for all products in the database. Shows 77 records.

SELECT Product.*,
       Category.CategoryName
  FROM Product
       JOIN
       Category ON Product.CategoryId = Category.Id;

-- Display the order Id and shipper CompanyName for all orders placed before August 9 2012. Shows 429 records.

SELECT [Order].id,
       [Order].OrderDate,
       [Order].ShipVia,
       Shipper.CompanyName
  FROM [Order]
       JOIN
       Shipper ON [Order].ShipVia = Shipper.id
 WHERE [Order].OrderDate < '2012-08-09';

-- Display the name and quantity of the products ordered in order with Id 10251. Sort by ProductName. Shows 3 records.

SELECT *,
       Product.ProductName
  FROM OrderDetail
       JOIN
       Product ON Product.Id = OrderDetail.ProductId
 WHERE OrderDetail.OrderId = 10251
 ORDER BY Product.ProductName ASC;

-- Display the OrderID, Customer's Company Name and the employee's LastName for every order. All columns should be labeled clearly. Displays 16,789 records.

SELECT [Order].id as 'Order Id',
       Customer.CompanyName as 'Customer Company Name',
       Employee.LastName as 'Employee Last Name'
  FROM [Order]
       JOIN
       Customer ON [Order].CustomerId = Customer.Id
       JOIN
       Employee ON [Order].EmployeeId = Employee.Id;