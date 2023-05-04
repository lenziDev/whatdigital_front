import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINT } from "../constants";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  is_checked: boolean;
}

function compare(a: any, b: any, isAsc: boolean) {
if (a === undefined || b === undefined) {
    return 0;
}
return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

const Table = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState<string>("");
  const [sortColumn, setSortColumn] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<string>("asc");

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${API_ENDPOINT}products/`);
      setProducts(response.data);
    };
  
    fetchData();
  }, []);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleSelectProduct = async (id: number, isChecked: boolean) => {
    const updatedProduct = await axios.put(
      `${API_ENDPOINT}product/${id}/`,
      { is_checked: isChecked }
    );
    const updatedProducts = products.map((product) =>
      product.id === updatedProduct.data.id ? updatedProduct.data : product
    );
    const fetchData = async () => {
      const response = await axios.get(`${API_ENDPOINT}products/`);
      setProducts(response.data);
    };
  
    fetchData();
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase())
  );
  
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value.toLowerCase());
  };

  const sortedProducts = filteredProducts.sort((a, b) => {
    const isAsc = sortDirection === "asc";
    if (sortColumn === "name") {
      return compare(a.name, b.name, isAsc);
    } else if (sortColumn === "description") {
      return compare(a.description, b.description, isAsc);
    } else if (sortColumn === "price") {
      return compare(a.price, b.price, isAsc);
    } else {
      return 0;
    }
  });

  return (
    <div className="table-container">
      <input type="text" placeholder="Search" onChange={handleSearch} />
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("name")}>Name</th>
            <th onClick={() => handleSort("description")}>Description</th>
            <th onClick={() => handleSort("price")}>Price</th>
            <th onClick={() => handleSort("stock")}>Stock</th>
            <th>Is Checked</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.price}</td>
              <td>{product.stock}</td>
              <td>{product.is_checked ? "Yes" : "No"}</td>
              <td>
                <button onClick={() => handleSelectProduct(product.id, !product.is_checked)}>
                  {product.is_checked ? "Unselect" : "Select"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;