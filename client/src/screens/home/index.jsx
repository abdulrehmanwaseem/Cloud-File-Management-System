import React, { useState } from "react";
import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  ChevronsLeft,
  ChevronsRight,
  FileUp,
  MonitorPlay,
  Search,
  Trash2,
} from "lucide-react";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";
import {
  useDeleteFileMutation,
  useGetFilesQuery,
  useUploadFilesMutation,
} from "../../redux/apis/fileApi";
import { useDispatch } from "react-redux";
import { openModal } from "../../redux/slice/modal";
import FilesList from "../../components/FilesList";

const Home = () => {
  const [filters, setFilters] = useState({
    search: "",
    sortOrder: 1,
    sortBy: "_id",
    perPage: 18,
    page: 1,
  });
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { data } = useGetFilesQuery(filters);
  const dispatch = useDispatch();

  const toggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
    setSelectedFiles([]);
  };

  return (
    <div className="flex flex-col gap-4 h-fit p-6">
      <ActionBtns
        dispatch={dispatch}
        toggleDeleteMode={toggleDeleteMode}
        selectedFiles={selectedFiles}
        isDeleteMode={isDeleteMode}
      />
      <Filters setFilters={setFilters} filters={filters} data={data} />
      <FilesList
        data={data?.files}
        dispatch={dispatch}
        isDeleteMode={isDeleteMode}
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
      />
    </div>
  );
};

const ActionBtns = ({
  dispatch,
  toggleDeleteMode,
  selectedFiles,
  isDeleteMode,
}) => {
  const [uploadFiles] = useUploadFilesMutation();
  const [deleteFiles] = useDeleteFileMutation();

  const deleteManyFiles = () => {
    if (!selectedFiles.length) {
      toggleDeleteMode();
    } else if (isDeleteMode) {
      dispatch(
        openModal({
          modal: "delete",
          multiple: true,
          data: selectedFiles,
          title: "Delete Files",
          callback: { deleteFiles, toggleDeleteMode },
        })
      );
    } else {
      toggleDeleteMode();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-3 justify-between bg-sky-700 rounded-xl p-3">
      <div className="flex flex-col lg:flex-row gap-3">
        <button
          className="btn lg:btn-wide w-full"
          onClick={() =>
            dispatch(
              openModal({
                modal: "fileUpload",
                modalClassName: "max-w-5xl",
                multiple: true,
                title: "Upload Files",
                callback: uploadFiles,
              })
            )
          }
        >
          <FileUp />
          Upload Files
        </button>
        <button
          className="btn lg:btn-wide w-full"
          onClick={() =>
            dispatch(
              openModal({
                modal: "stream",
                modalClassName: "max-w-5xl",
                multiple: true,
                title: "Stream Video Files",
                callback: uploadFiles,
              })
            )
          }
        >
          <MonitorPlay />
          Stream Large Video
        </button>
      </div>

      <button className="btn lg:btn-wide w-full" onClick={deleteManyFiles}>
        <Trash2 />
        Delete Many Files
      </button>
    </div>
  );
};

const Filters = ({ filters, setFilters, data }) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSort = () => {
    setFilters({ ...filters, sortOrder: filters.sortOrder === 1 ? -1 : 1 });
  };

  const sortIcon = () => {
    return filters.sortOrder === -1 ? (
      <ArrowUpNarrowWide />
    ) : (
      <ArrowDownWideNarrow />
    );
  };
  const handleSearchInput = (e) => {
    const { value } = e.target;
    setSearchValue(value);

    if (value === "") {
      setFilters({ ...filters, search: value });
    }
  };

  const handleSearchBtn = () => {
    setFilters({ ...filters, search: searchValue });
  };

  const perPageOptions = Array.from({ length: 5 }, (_, i) => (i + 1) * 10);

  return (
    <div className="flex flex-col lg:flex-row gap-3 justify-between bg-sky-700 rounded-xl p-3">
      <div className="flex flex-col lg:flex-row gap-3 sm: w-full">
        <label className="flex justify-between items-center input w-full">
          <input
            type="text"
            placeholder="Search here"
            className="input w-full focus:border-none"
            onChange={handleSearchInput}
            value={searchValue}
            onKeyDown={(e) => e.key === "Enter" && handleSearchBtn()}
          />
          <Search className="cursor-pointer" onClick={handleSearchBtn} />
        </label>
        <div className="flex gap-1 w-full">
          <button className="btn btn-md w-20 lg:w-fit" onClick={handleSort}>
            {sortIcon()}
          </button>
          <select
            className="select select-bordered w-full lg:w-fit max-w-full"
            onClick={(e) => {
              e.target.value !== "" &&
                setFilters({ ...filters, sortBy: e.target.value });
            }}
          >
            <option value="" disabled selected>
              Sort By
            </option>
            {Object.keys(data?.files[0] || {})
              .filter(
                (i) => i !== "filesUrl" && i !== "uploader" && i !== "_id"
              )
              .map((val, i) => (
                <option key={i} value={val}>
                  {val}
                </option>
              ))}
          </select>
        </div>
        {/*  */}
      </div>
      <div className="flex justify-between gap-[0.65rem] lg:justify-end items-center w-full">
        <ResponsivePagination
          previousLabel={<ChevronsLeft strokeWidth={"3px"} />}
          nextLabel={<ChevronsRight strokeWidth={"3px"} />}
          current={filters.page}
          total={Math.ceil(data?.totalRecords / filters.perPage) || 1}
          onPageChange={(val) => {
            setFilters({ ...filters, page: val });
          }}
        />
        <select
          className="select select-bordered w-full lg:w-fit max-w-full"
          onClick={(e) => {
            let value = e.target.value;
            value !== "" &&
              setFilters({
                ...filters,
                perPage: value,
                page: 1,
              });
          }}
        >
          <option value="" disabled selected>
            Files per page
          </option>
          {perPageOptions.map((value, index) => (
            <option key={index} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Home;
