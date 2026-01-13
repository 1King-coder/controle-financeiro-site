import React from "react";
import { DataGridBox, DzImageDiv, DzLabel, DzSvg, FileNameSpan, GeneralBox, InputBox } from "./styled";
import { SubTitle2, Title } from "../../styles/GlobalStyles";
import { Button, FileInput, Label, TextInput } from "flowbite-react";
import axios from "../../services/axios";
import { Banco } from "../../types/Banco";
import { DataGrid } from "@mui/x-data-grid";
import * as colors from "../../config/colors";
import { toast } from "react-toastify";
import { useAuth } from "../../services/useAuth";
import { read, utils } from "xlsx";

export default function AddBancos() {
  const { user } = useAuth();
  const inputFileRef = React.useRef<HTMLInputElement>(null);

  function handleUploadPlanilha(event: React.ChangeEvent<HTMLInputElement>) {
    const inputElement = event.target as HTMLInputElement;
    
    console.log(inputElement.files);
    if (inputElement && inputElement.files && inputElement.files.length > 0) {

      document.querySelector<HTMLElement>('#file-name')!.innerText = inputElement.files[0].name;
      const file = inputElement.files[0];
      let fr = new FileReader();

      fr.onload = () => {
        const data = fr.result;
        console.log(data);
        if (data) {
          const workbook = read(data, { type: 'binary' });
          console.log(utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]));
        }
      }

      fr.readAsArrayBuffer(file);

    }
  }

  return (
    <GeneralBox>
      <Title>Envia dados financeiros por planilha</Title>
      <div style={{
        display: "flex",
        flexDirection: "row",
        margin: "1rem auto",
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          alignItems: "center",
          justifyContent: "center", 
        }}>
          <DzLabel
            htmlFor="dropzone-file"
          >
            <DzImageDiv>
              <DzSvg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </DzSvg>
              <p style={{
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                color: "white"
              }}>
                <span style={{ fontWeight: 600 }}>Clique para fazer upload</span> ou arraste e solte
              </p>
              <p style={{
                textAlign: "center",
                fontSize: '0.75rem',
                color: "white"
              }}>XLSX</p>
            </DzImageDiv>
            <FileInput id="dropzone-file" style={{visibility: "hidden"}} onChange={handleUploadPlanilha}/>
            <FileNameSpan id="file-name"></FileNameSpan>
          </DzLabel>
        </div>

        
      </div>
      
      
    </GeneralBox>
  );
}