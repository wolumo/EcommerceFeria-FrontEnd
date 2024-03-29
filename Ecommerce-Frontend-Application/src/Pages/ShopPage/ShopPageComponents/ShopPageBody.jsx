import React, { useState, useContext, useEffect } from "react";
//import { products } from "../../../Constants";
import axios from "axios";
import { CardProduct } from "../../../Components";
import { FilterShopComponent } from "../ShopPageComponents";
import Modal from "react-modal";
import { FilterContext } from "../../../Contexts/FilterModal/FilterContext";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/minimal.css";
import { Navigate } from "react-router-dom";
//import {GetProducts} from '../../../Services/Products'
function ShopPageBody() {
  Modal.setAppElement(document.getElementById("root"));
  const { isFilter, modifyingIsFilter } = useContext(FilterContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentItems, setCurrentItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 4;
  const [itemOffset, setItemOffset] = useState(currentPage * itemsPerPage);
  const [products, setProducts] = useState([]);

  const customStyles = {
    content: {
      top: "72%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "100%",
    },
  };

  const showProducts = () => {
    axios
      .get("http://ec2-54-226-200-205.compute-1.amazonaws.com/v1/product")
      .then((res) => {
        console.log(res.data);
        setProducts(res.data);
      });
  };

  useEffect(() => {
    showProducts();
  }, []);

  useEffect(() => {
    if (Array.isArray(products)) {
      const startOffset = itemOffset - itemsPerPage;
      console.log("Voy desde " + startOffset + " Hasta" + itemOffset);
      setCurrentItems(products.slice(startOffset, itemOffset));
      setTotalPages(Math.ceil(products.length / itemsPerPage));
    }
  }, [itemOffset, itemsPerPage, products]);

  function handlePageChange(page) {
    console.log(page);
    const newOffset = page * itemsPerPage;
    setItemOffset(newOffset);
    setCurrentPage(page);
    console.log("He cambiado ahora inicio en", newOffset);
  }

  return (
    <section className="sm:border-2">
      <div className="mx-[2rem]">
        <h1 className="text-[28px] font-semibold sm:hidden">Tienda</h1>
        <div className="mt-2 flex w-full justify-between sm:hidden">
          <button className="bg-slate-950 text-white w-[155px] h-[40px]">
            Buscar
          </button>
          <button
            onClick={modifyingIsFilter}
            className="bg-slate-950 text-white w-[155px] h-[40px]"
          >
            Filtrar
          </button>
        </div>
        <div className="mt-[2rem] sm:grid grid-cols-2">
          {currentItems.map((product) => (
            <CardProduct props={product} />
          ))}
        </div>
        <div className="flex flex-row w-[100%] justify-center my-5">
          <ResponsivePagination
            total={totalPages}
            current={currentPage}
            onPageChange={(page) => handlePageChange(page)}
          ></ResponsivePagination>
        </div>
      </div>

      <Modal isOpen={isFilter} style={customStyles}>
        <div className="w-full">
          <FilterShopComponent />
        </div>
      </Modal>
    </section>
  );
}

export default ShopPageBody;
