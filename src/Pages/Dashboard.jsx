import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, Navigate } from "react-router";
import { Modal, Button } from "rsuite";
export default function Dashboard(props) {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [updatePointer, setUpdatePointer] = useState();
  const [newData, setNewData] = useState("");

  //modal to updateData
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //modal to addColumn
  const [open2, setOpen2] = React.useState(false);
  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => setOpen2(false);
  const [colName, setColName] = useState("");

  //modal to addRow
  const [open3, setOpen3] = React.useState(false);
  const handleOpen3 = () => setOpen3(true);
  const handleClose3 = () => setOpen3(false);
  const [rowName, setrowName] = useState("");

  const test = () => {
    fetch("/data/test", {
      method: "POST",
      credentials: "include",

      headers: {
        "content-type": "application/json",
      },
    }).then();
  };

  const updateData = async (row_id, rowData, index, rowIndex, newData) => {
    console.log(row_id, rowData, index, rowIndex, newData);
    let newArr = [...rowData];
    newArr[index] = newData;
    fetch("/data/update", {
      method: "POST",
      credentials: "include",

      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        _id: props.user._id,
        row_id: row_id,
        arrData: newArr,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        {
          //updating the data in client state
          let newData = [...data];
          newData[rowIndex].data = res.data;
          setData([...newData]);
        }
      });
  };

  const addColumn = async () => {
    fetch("/data/addColumn", {
      method: "POST",
      credentials: "include",

      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        _id: props.user._id,
        columnName: colName,
      }),
    }).then((res) => {
      if (res.status === 200) {
        let newUser = props.user;
        newUser.columnData.push(colName);
        props.setUser({ ...newUser });
        let newData = data
        newData.forEach(row => {
            row.data.push('')
        })
        console.log('newD', newData)
        setData([...newData])
      }
      //console.log(res.status)
    });
  };

  const addRow = async () => {
    fetch("/data/addRow", {
        method: "POST",
        credentials: "include",
  
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          _id: props.user._id,
          rowName: rowName,
          length:props.user.columnData.length
        }),
      })
      .then((res) => {
        if (res.status === 200) {
         return res
        }
        //console.log(res.status)
      })
      .then(res => res.json())
      .then((res) =>{
        let newData = data;
        newData.push(res)
       setData([...newData]);
       let newUser = props.user
       newUser.rows.push(res._id)
      } )

  };
  //getDataByRows
  useEffect(() => {
    if (props.user) {
      fetch("/data/getDataOfRows", {
        method: "POST",
        credentials: "include",

        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          _id: props.user._id,
          row_ids: props.user.rows,
        }),
      })
        .then((res) => res.json())
        .then((data) => setData(data));
    }
  }, []);

  console.log(data);
  return (
    <div>
      {props.user === null ? (
        <Navigate to="/login" />
      ) : (
        <>
          {/* <button onClick={test}>test Cookie</button> */}

          <Modal open={open} onClose={handleClose}>
            <Modal.Header>
              <Modal.Title>Update Data</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <input
                placeholder={updatePointer?.rowRawData}
                onChange={(e) => setNewData(e.target.value)}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button
                onClick={() => {
                  updateData(
                    updatePointer.rowid,
                    updatePointer.rowData,
                    updatePointer.index,
                    updatePointer.rowIndex,
                    newData
                  );
                  handleClose();
                }}
                appearance="primary"
              >
                Ok
              </Button>
              <Button onClick={handleClose} appearance="subtle">
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>

          {/* modal for addColumn */}
          <Modal open={open2} onClose={handleClose2}>
            <Modal.Header>
              <Modal.Title>Add new Column</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <input
                placeholder="New Column Name"
                onChange={(e) => setColName(e.target.value)}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button
                onClick={() => {
                  addColumn();
                  handleClose2();
                }}
                appearance="primary"
              >
                Ok
              </Button>
              <Button onClick={handleClose2} appearance="subtle">
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>

          {/* modal for addRow */}
          <Modal open={open3} onClose={handleClose3}>
            <Modal.Header>
              <Modal.Title>Add new Row</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <input
                placeholder="New Row Name"
                onChange={(e) => setrowName(e.target.value)}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button
                onClick={() => {
                  addRow();
                  handleClose3();
                }}
                appearance="primary"
              >
                Ok
              </Button>
              <Button onClick={handleClose3} appearance="subtle">
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>

          <h3>Hello, {props.user.username}</h3>
          <button className="signOut btn-warning" onClick={()=>{
            props.setUser(null)
            //send clearcookie req
          }}>SignOut</button>
          <table class="table">
            <tr>
            <th></th>
              {props.user.columnData.map((col) => {
                return <th>{col}</th>;
              })}
              <tr>
                <button className="AddBtn" onClick={handleOpen2}>Add Column</button>
              </tr>
            </tr>
            <tbody>
              {data.map((row, rowIndex) => {
                return (
                  <tr>
                    <th>{row.rowName}</th>
                    {row.data.map((rowRawData, index) => {
                      return (
                        <td
                          class="border"
                          key={index}
                          onClick={() => {
                            handleOpen();
                            setUpdatePointer({
                              rowid: row._id,
                              rowData: row.data,
                              index,
                              rowIndex,
                              rowRawData,
                            });
                          }}
                        >
                          {rowRawData}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              <tr>
                <button  className="AddBtn" onClick={handleOpen3}>Add Row</button>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
