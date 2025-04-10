import "./allDeligateList.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

import { useReactToPrint } from "react-to-print";
import { MdDelete } from "react-icons/md";
import { BsPencilSquare } from "react-icons/bs";
import { SiMicrosoftexcel } from "react-icons/si";
import { FaFilePdf } from "react-icons/fa6";
import { UseCampFirebase } from "../../../context/CampManagement";
import { downloadTableExcels } from "../../../utils/ResizeImage";
import CoppyWrite from "../../../components/coppyWrite/CoppyWrite";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

const DownloadTableExcel = ({ filename, sheet, currentTableRef, children }) => {
  const handleDownload = () => {
    downloadTableExcels(filename, sheet, currentTableRef);
  };

  return <div onClick={handleDownload}>{children}</div>;
};

const AllDeligateList = () => {
  const navigate = useNavigate();
  const campFirebase = UseCampFirebase();
  const [open, setOpen] = useState(false);
  const [forceByUpdate, setForceByUpdate] = useState(false);
  const [allDeligatet, setAllDeligate] = useState([]);

  const [liadingTrue, setLiadingTrue] = useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    const getAllData = async () => {
      try {
        const data = await campFirebase?.deleget_Data;

        // Filter the array to keep only objects where isHedeleget is "true"
        if(data && data.length > 0){ 
        const filteredData = data.filter((item) => item.isHedeleget === "true");
        filteredData.sort((a, b) => a.delegatId - b.delegatId);
        setAllDeligate(filteredData);
        setLiadingTrue(false);
      }
      } catch (error) {
        console.error("Error fetching regiments:", error.message);
      }
    };

    getAllData();
  }, [campFirebase, forceByUpdate]);

  //  ডিলিট ডেলিগেট
  const deleteDelegate = async (id, selectImage) => {
    console.log(id, selectImage);
    const userConfirmed = window.confirm("আপনি এই ডেলিগেট মুছে ফেলতে চান?");
    if (userConfirmed) {
      try {
        await campFirebase.deleteDeligate(id, selectImage);
        campFirebase.setForceByUpdate(!campFirebase.forceByUpdate)
      } catch (error) {
        console.error("Error deleting regiment:", error);
      }
    } else {
      console.log("Deletion canceled by user");
    }
  };

  // আপডেট ডেলিগেট
  const updateData = (delegateData) => {
    campFirebase.setDeligateUpdateData(delegateData);
    navigate("/detalseDeligetInfo/updateDeligat");
  };

  // excl
  const tableRef = useRef(null);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => {
      const printableContent = componentRef.current.cloneNode(true);

      // Exclude the element with className "downloadeShoit" from the printed content
      const elementsToExclude =
        printableContent.querySelectorAll(".downloadeShoit");
      elementsToExclude.forEach((element) => element.remove());

      // Exclude the element with className "regCreateBrnList" from the printed content
      const regCreateBrnList =
        printableContent.querySelector(".regCreateBrnList");
      regCreateBrnList && regCreateBrnList.remove();

      // Add custom styles to the printed content, including styles for homePageContainer
      const printStyles = document.createElement("style");
      printStyles.innerHTML = `
        .homePageContainer {
          margin-top: -170px;
         
        }
        .regimentTitle{
          padding-top: 30px;
          padding-bottom: 13px;
        }
        @page {
          margin-top: 60px;
          margin-bottom: 60px;
          margin-left: 35px;
          margin-right: 35px;
         
          content: "";
        }
      `;
      printableContent.appendChild(printStyles);

      return printableContent;
    },
    documentTitle: "অংশগ্রহণ কৃত ডেলিগেট সংখ্যা",

    onAfterPrint: () => console.log("Success"),
  });

  const seeDetalseInfo = (info) => {
    campFirebase.setInfoDetalse(info);
    navigate("/infoUpdateAndCreate");
  };

  const goToDetalseInfo = (id) => {
    // console.log(id)
    localStorage.setItem("goToDetalseInfo", id);

    navigate("/detalseDeligetInfo");
  };

  return (
    <>
      <div ref={componentRef} className="homePageContainer">
        <div style={{ marginBottom: "100px" }} className="regimentLest">
          <h1 className="regimentTitle">
            অংশগ্রহণ কৃত ডেলিগেট সংখ্যা: {allDeligatet?.length}
          </h1>
          <div className="downloadeShoit">
            <FaFilePdf className="pdfDownloade" onClick={handlePrint} />
            <DownloadTableExcel
              filename="অংশগ্রহণ কৃত সকল ডেলিগেট তালিকা"
              sheet="অংশগ্রহণ কৃত সকল ডেলিগেট তালিকা"
              currentTableRef={tableRef}
            >
              <SiMicrosoftexcel className="excelDownloade" />
            </DownloadTableExcel>
          </div>
          <table ref={tableRef} className="regimentTable">
            <tr>
              <th>ক্রম</th>
              <th>নাম</th>
              <th>পিতার নাম</th>
              <th>শ্রেণি</th>
              <th>শাখা</th>
              <th>সাংগঠনিক মান</th>
              <th>রেজিমেন্ট</th>
              <th>ডেলিগেট কোড</th>
              <th>তথ্য</th>
              <th>অ্যাকশন</th>
            </tr>

            {allDeligatet &&
              allDeligatet.map((deleget, index) => {
                return (
                  <HtmlTooltip
                    key={deleget.id}
                    title={
                      <>
                        <div>
                          {deleget.createByName && (
                            <p>Created By: {deleget.createByName}</p>
                          )}
                          {deleget?.lastUpdateBy && (
                            <p>Last Update By: {deleget.lastUpdateBy}</p>
                          )}
                        </div>
                        <button
                          onClick={() => seeDetalseInfo(deleget)}
                          className="detalseInfoo"
                        >
                          Details
                        </button>
                      </>
                    }
                  >
                    <tr>
                      <td>{index + 1}</td>
                      <td>{deleget.fullNameBangla}</td>
                      <td>{deleget.fatherNameBangla}</td>
                      <td>{deleget.classValue}</td>
                      <td>{deleget.brance}</td>
                      <td>
                        <span>
                          {deleget.organizationalvalues !== "প্রযোজ্য নয়" &&
                            deleget.organizationalvalues + ", "}
                        </span>

                        {deleget.senOrganizationalvalues !== "প্রযোজ্য নয়" &&
                          deleget.senOrganizationalvalues}
                      </td>
                      <td>{deleget.regiment}</td>
                      <td>
                        44.24.{String(deleget.delegatId).padStart(4, "0")}
                      </td>
                      <td>
                        <span
                          onClick={() => goToDetalseInfo(deleget.id)}
                          className="detalseInfo"
                        >
                          বিস্তারিত তথ্য
                        </span>
                      </td>
                      <td className="actionud">
                        <BsPencilSquare
                          className="updateBtn"
                          onClick={() => updateData(deleget)}
                        />
                        <MdDelete
                          className="deleteBtn"
                          onClick={() =>
                            deleteDelegate(deleget.id, deleget.selectImage)
                          }
                        />
                      </td>
                    </tr>
                  </HtmlTooltip>
                );
              })}
          </table>

          {liadingTrue && (
            <div style={{ marginTop: "30px" }} className="animation-hr">
              <hr className="hr1" />
              <hr className="hr2" />
              <hr className="hr3" />
              <hr className="hr4" />
            </div>
          )}
          {/* <div className="regCreateBrnList">
            <button onClick={handleClickOpen} className="regimentBtn">
              রেজিমেন্ট নির্ধারণ করুন
            </button>
            <button
              onClick={() => navigate("/branchDetermination")}
              className="regimentBtn margintop"
            >
              পরবর্তী
            </button>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default AllDeligateList;
