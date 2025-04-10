import { useEffect, useState } from "react";
import "./DelegetRegistration.css";

import Fireworks from "react-canvas-confetti/dist/presets/fireworks";

import { MdCloudUpload } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";

import districtNames from "../../data/DistrictNames";
import branchNames from "../../data/Brance";
import { resizeImage } from "../../utils/ResizeImage";
import { RegimentFirebase } from "../../context/RegimentContext";

const canvasStyles = {
  position: "fixed",
  pointerEvents: "none",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const DelegetRegistration = () => {
  const campFirebase = RegimentFirebase();

  const [open, setOpen] = useState(false);

  // State variables for input fields
  const [brance, setBrance] = useState("");
  const [fullNameBangla, setFullNameBangla] = useState("");
  const [fullNameEnglish, setFullNameEnglish] = useState("");
  const [fatherNameBangla, setFatherNameBangla] = useState("");
  const [fatherNameEnglish, setFatherNameEnglish] = useState("");
  const [motherNameBangla, setMotherNameBangla] = useState("");
  const [motherNameEnglish, setMotherNameEnglish] = useState("");
  const [asor, setAsor] = useState("");
  const [school, setSchool] = useState("");
  const [previousCampNumber, setPreviousCampNumber] = useState("");
  const [address, setAddress] = useState("");
  const [regiment, setRegiment] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [classValue, setClassValue] = useState("");
  const [district, setDistrict] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [code, setCode] = useState("");
  const [year, setYear] = useState("");
  const [previousCampCount, setPreviousCampCount] = useState("");
  const [selectImage, setSelectImage] = useState(null);
  const [organizationalvalues, setOrganizationalvalues] = useState("");
  const [senOrganizationalvalues, setSenOrganizationalvalues] = useState("");
  const [senValueDate, setSenValueDate] = useState("");
  const [isHedeleget, setIsHedeleget] = useState(null);
  const [regimentData, setRegimentData] = useState([]);
  const [branceData, setBranceData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [ahowconfetti, setAhowconfetti] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (ahowconfetti) {
      const timeoutId = setTimeout(() => {
        setAhowconfetti(false);
      }, 5000);

      return () => clearTimeout(timeoutId);
    }
  }, [ahowconfetti]);

  useEffect(() => {
    const getAllData = async () => {
      try {
        const data = await campFirebase.getRegiments();
        setRegimentData(data);
      } catch (error) {
        console.error("Error fetching regiments:", error.message);
      }
    };

    getAllData();
  }, [campFirebase]);

  useEffect(() => {
    const getAllData = async () => {
      try {
        const data = await campFirebase.getBrance();
        setBranceData(data);
      } catch (error) {
        console.error("Error fetching regiments:", error.message);
      }
    };

    getAllData();
  }, [campFirebase]);

  const resetForm = () => {
    setBrance("");
    setFullNameBangla("");
    setFullNameEnglish("");
    setFatherNameBangla("");
    setFatherNameEnglish("");
    setMotherNameBangla("");
    setMotherNameEnglish("");
    setAsor("");
    setSchool("");
    setPreviousCampNumber("");
    setAddress("");
    setRegiment("");
    setMobileNumber("");
    setClassValue("");
    setDistrict("");
    setJoiningDate("");
    setCode("");
    setYear("");
    setPreviousCampCount("");
    setSelectImage(null);
    setOrganizationalvalues("");
    senOrganizationalvalues("");
    senValueDate("");
    setSenOrganizationalvalues("");
    setSenValueDate("");
    isHedeleget(null);
  };

  const handleSubmit = async () => {
    let resizedImage;
    if (selectImage) {
      resizedImage = await resizeImage(selectImage, 280, 280);
    } else {
      // Handle the case when no image is selected
      console.log("No image selected");
    }
    console.log(
      brance,
      fullNameBangla,
      fullNameEnglish,
      fatherNameBangla,
      fatherNameEnglish,
      motherNameBangla,
      motherNameEnglish,
      asor,
      school,
      previousCampNumber,
      address,
      regiment,
      mobileNumber,
      classValue,
      district,
      joiningDate,
      code,
      year,
      previousCampCount,
      organizationalvalues,
      senOrganizationalvalues,
      senValueDate,
      isHedeleget,
      resizedImage
    );
    try {
      setLoading(true);
      const result = await campFirebase.ctereateDeligate(
        brance,
        fullNameBangla,
        fullNameEnglish,
        fatherNameBangla,
        fatherNameEnglish,
        motherNameBangla,
        motherNameEnglish,
        asor,
        school,
        previousCampNumber,
        address,
        regiment,
        mobileNumber,
        classValue,
        district,
        joiningDate,
        code,
        year,
        previousCampCount,
        organizationalvalues,
        senOrganizationalvalues,
        senValueDate,
        isHedeleget,
        resizedImage
      );
      if (result) {
        setLoading(false);
        console.log(result);
        handleClose();
        setAhowconfetti(true);
        resetForm();
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const registerDelegated = async (e) => {
    e.preventDefault();
    setOpen(true);
  };

  return (
    <div className="delegateRegContainer">
      {ahowconfetti && (
        <Fireworks autorun={{ speed: 2.7 }} style={canvasStyles} />
      )}

      <h1 className="regTitle">কুঁড়ির ব্যক্তিগত তথ্য ফরম</h1>
      <form onSubmit={registerDelegated} className="regForm">
        <div className="userdatacontent">
          <div className="regLest">
            <div>
              <span>শাখা*</span>
              <select
                value={brance}
                onChange={(e) => setBrance(e.target.value)}
                required
              >
                <option value="" disabled hidden>
                  শাখা যুক্ত করুন
                </option>
                {branchNames.map((brance) => (
                  <option key={brance.branchName} value={brance.branchName}>
                    {brance.branchName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span>পূর্ণ নাম (বাংলা)*</span>
              <input
                type="text"
                value={fullNameBangla}
                onChange={(e) => setFullNameBangla(e.target.value)}
                placeholder="নাম"
                name=""
                id=""
                required
              />
            </div>

            <div>
              <span>পূর্ণ নাম (ইংরেজি)*</span>
              <input
                type="text"
                value={fullNameEnglish}
                onChange={(e) => setFullNameEnglish(e.target.value)}
                placeholder="Name"
                name=""
                id=""
                required
              />
            </div>

            <div>
              <span>পিতার নাম (বাংলা)*</span>
              <input
                type="text"
                value={fatherNameBangla}
                onChange={(e) => setFatherNameBangla(e.target.value)}
                placeholder="পিতার নাম"
                name=""
                id=""
                required
              />
            </div>

            <div>
              <span>পিতার নাম (ইংরেজি)*</span>
              <input
                type="text"
                value={fatherNameEnglish}
                onChange={(e) => setFatherNameEnglish(e.target.value)}
                placeholder="father's name"
                name=""
                id=""
                required
              />
            </div>

            <div>
              <span>মাতার নাম (বাংলা)*</span>
              <input
                type="text"
                value={motherNameBangla}
                onChange={(e) => setMotherNameBangla(e.target.value)}
                placeholder="মাতার নাম"
                name=""
                id=""
                required
              />
            </div>

            <div>
              <span>মাতার নাম (ইংরেজি)*</span>
              <input
                type="text"
                value={motherNameEnglish}
                onChange={(e) => setMotherNameEnglish(e.target.value)}
                placeholder="mother's name"
                name=""
                id=""
                required
              />
            </div>

            <div>
              <span>আসরের নাম*</span>
              <input
                type="text"
                value={asor}
                onChange={(e) => setAsor(e.target.value)}
                placeholder="আসরের নাম"
                name=""
                id=""
                required
              />
            </div>

            <div>
              <span>শিক্ষা প্রতিষ্ঠান*</span>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="শিক্ষা প্রতিষ্ঠান"
                name=""
                id=""
                required
              />
            </div>

            <div>
              <span>শ্রেণী*</span>
              <input
                type="text"
                value={classValue}
                onChange={(e) => setClassValue(e.target.value)}
                placeholder="শ্রেণী"
                name=""
                id=""
                required
              />
            </div>
            <div>
              <span>ঠিকানা*</span>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="ঠিকানা"
                name=""
                id=""
                required
              />
            </div>
          </div>
          <div className="regRight">
            <div>
              <span>রেজিমেন্ট</span>
              <select
                value={regiment}
                onChange={(e) => setRegiment(e.target.value)}
              >
                <option value="" disabled hidden>
                  রেজিমেন্ট যুক্ত করুন
                </option>
                {regimentData &&
                  regimentData.map((reg) => (
                    <option key={reg.regimentName} value={reg.regimentName}>
                      {reg.regimentName}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <span>মোবাইল নাম্বার*</span>
              <input
                type="text"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="মোবাইল নাম্বার"
                name=""
                id=""
                required
              />
            </div>

            <div>
              <span>সাংগঠনিক মান</span>
              <select
                value={senOrganizationalvalues}
                onChange={(e) => setSenOrganizationalvalues(e.target.value)}
              >
                <option value="" disabled hidden>
                  সুবাসিত/ বিকশিত/ ধীমান
                </option>
                <option value="সুবাসিত">সুবাসিত</option>
                <option value="বিকশিত">বিকশিত</option>
                <option value="ধীমান">ধীমান</option>
                <option value="অভিযাত্রী">অভিযাত্রী</option>
                <option value="প্রযোজ্য নয়">প্রযোজ্য নয়</option>
              </select>
            </div>

            <div>
              <span>
                {senOrganizationalvalues &&
                  (senOrganizationalvalues === "সুবাসিত"
                    ? "সুবাসিত হওয়ার তারিখ"
                    : senOrganizationalvalues === "বিকশিত"
                    ? "বিকশিত হওয়ার তারিখ"
                    : senOrganizationalvalues === "ধীমান"
                    ? "ধীমান হওয়ার তারিখ"
                    : senOrganizationalvalues === "অভিযাত্রী"
                    ? "অভিযাত্রী হওয়ার তারিখ"
                    : "তারিখ")}
                {!senOrganizationalvalues && "তারিখ"}
              </span>
              <input
                type="date"
                value={senValueDate}
                onChange={(e) => setSenValueDate(e.target.value)}
                name=""
                id=""
              />
            </div>

            <div>
              <span>পূর্বের ক্যাম্পে সংখ্যা*</span>
              <input
                type="number"
                value={previousCampNumber}
                onChange={(e) => setPreviousCampNumber(e.target.value)}
                placeholder="পূর্বের ক্যাম্প সংখ্যা"
                name=""
                id=""
                required
              />
            </div>
            <div>
              <span>পূর্বের ক্যাম্পের সাল</span>
              <input
                type="tetx"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="পূর্বের ক্যাম্পের সাল"
                name=""
                id=""
              />
            </div>

            <div>
              <span>নিজ জেলা*</span>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
              >
                <option value="">জেলা</option>
                {districtNames.map((names) => (
                  <option key={names.id} value={names.bn_name}>
                    {names.bn_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span>সাংগঠনিক মান*</span>
              <select
                value={organizationalvalues}
                onChange={(e) => setOrganizationalvalues(e.target.value)}
                required
              >
                <option value="" disabled hidden>
                  সাংগঠনিক মান*
                </option>
                <option value="চৌকস">চৌকস</option>
                <option value="অগ্রপথিক">অগ্রপথিক</option>
                <option value="প্রযোজ্য নয়">প্রযোজ্য নয়</option>
              </select>
            </div>

            <div>
              <span>
                {organizationalvalues && organizationalvalues === "চৌকস"
                  ? "চৌকস হওয়ার তারিখ*"
                  : organizationalvalues === "অগ্রপথিক"
                  ? "অগ্রপথিক হওয়ার তারিখ*"
                  : "তারিখ"}
              </span>
              <input
                type="date"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                placeholder="চৌকস হওয়ার তারিখ"
                required={organizationalvalues !== "প্রযোজ্য নয়"}
                name=""
                id=""
              />
            </div>

            <div>
              <span>
                {organizationalvalues && organizationalvalues === "চৌকস"
                  ? "চৌকস কোড*"
                  : organizationalvalues === "অগ্রপথিক"
                  ? "অগ্রপথিক কোড*"
                  : "কোড"}
              </span>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="কোড"
                name=""
                id=""
                required={organizationalvalues !== "প্রযোজ্য নয়"}
              />
            </div>

            {/* <div>
              <span>পূর্বের ক্যাম্পের সংখ্যা</span>
              <input
                type="number"
                value={previousCampCount}
                onChange={(e) => setPreviousCampCount(e.target.value)}
                placeholder="পূর্বের ক্যাম্পের সংখ্যা"
                name=""
                id=""
                required
              />
            </div> */}

            <div>
              <span>ছবি</span>
              <input
                type="file"
                onChange={(e) => setSelectImage(e.target.files[0])}
                placeholder=""
                accept="image/*"
                className="custom-file-input"
              />
            </div>
          </div>
        </div>

        <div className="selectImage">
          {selectImage && (
            <div className="uploadeShow">
              <span onClick={() => setSelectImage(null)} className="crosImage">
                <IoClose className="crosImageIcon" />
              </span>
              <img
                className="selectadeImage"
                src={URL.createObjectURL(selectImage)}
                alt={selectImage.name}
              />
            </div>
          )}
          <button
            style={{ width: "260px" }}
            className="deligetSubmitBtn"
            type="submit"
          >
            রেজিষ্ট্রেশন নিশ্চিত করুন
          </button>
        </div>

        <>
          <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
          >
            <DialogTitle
              sx={{
                marginBottom: "-20px",
                fontWeight: "bold",
              }}
              id="customized-dialog-title"
            >
              <IoClose
                style={{ marginRight: "auto" }}
                className="closeIcons"
                onClick={handleClose}
              />
            </DialogTitle>
            <DialogTitle
              sx={{ m: 0, p: 1, paddingBottom: "2px" }}
              id="customized-dialog-title"
            >
              <div className="popupSelection">
                <span>আপনার ক্যাটাগরি নির্বাচন করুন*</span>
                <br />
                <select
                  style={{ marginBottom: "30px" }}
                  value={isHedeleget}
                  onChange={(e) => setIsHedeleget(e.target.value)}
                >
                  <option value="">নির্বাচন করুন</option>
                  <option value={true}>ডেলিগেট</option>
                  <option value={false}>সংগঠক</option>
                </select>
              </div>
              {isHedeleget && (
                <button
                  style={{ marginTop: "0px" }}
                  className="deligetSubmitBtn"
                  onClick={() => handleSubmit()}
                  disabled={loading}
                >
                  {loading ? (
                    <Box
                      sx={{
                        marginBottom: "-3px",
                        marginTop: "-3px",
                        margin: "0 auto",
                      }}
                    >
                      <CircularProgress size={25} color="inherit" />
                    </Box>
                  ) : (
                    "রেজিষ্ট্রেশন করুন"
                  )}
                </button>
              )}
            </DialogTitle>
          </BootstrapDialog>
        </>
      </form>
    </div>
  );
};

export default DelegetRegistration;
