import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

import { useReactToPrint } from "react-to-print";
import { MdDelete } from "react-icons/md";
import { BsPencilSquare } from "react-icons/bs";
import { SiMicrosoftexcel } from "react-icons/si";
import { FaFilePdf } from "react-icons/fa6";


import { UseCampFirebase } from "../../../context/CampManagement";
import { downloadTableExcels } from "../../../utils/ResizeImage";


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

const SliceDeleget = () => {
  const navigate = useNavigate();
  const params = useParams()
  const campFirebase = UseCampFirebase();
  const [open, setOpen] = useState(false);
  const [forceByUpdate, setForceByUpdate] = useState(false);
  const [allDeligatet, setAllDeligate] = useState(campFirebase.analysisData);

  useEffect(() => {
    setAllDeligate(campFirebase.analysisData)
   }, [campFirebase.forceByUpdate])
  
  //  campFirebase.setForceByUpdate(!campFirebase.forceByUpdate)
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
    documentTitle: params.data.replace("সংখ্যাঃ", ''),

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
            {params.data} {allDeligatet?.length}
          </h1>
          <div className="downloadeShoit">
            <FaFilePdf className="pdfDownloade" onClick={handlePrint} />
            <DownloadTableExcel
              filename={params.data.replace("সংখ্যাঃ", '')}
              sheet={"ডেলিগেট"}
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
        </div>
      </div>
     
    </>
  );
};

export default SliceDeleget;



