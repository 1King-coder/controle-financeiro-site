import React from "react";
import {  DzImageDiv, DzLabel, DzSvg, FileNameSpan, GeneralBox, InputBox } from "./styled";
import { StyledButton, StyledButtonGroup, SubTitle2, Title } from "../../styles/GlobalStyles";
import { Button, FileInput } from "flowbite-react";
import axios from "../../services/axios";
import { Banco, SaldoBancoPorCategoria } from "../../types/Banco";
import { DataGrid } from "@mui/x-data-grid";
import * as colors from "../../config/colors";
import { toast } from "react-toastify";
import { useAuth } from "../../services/useAuth";
import { read, utils, WorkBook } from "xlsx";
import { SheetNames, EntradasSaidasColumns, TransferenciasColumns } from "../../config/ssChkConstants";
import { getJsDateFromExcel } from "excel-date-to-js";
import { Categoria, SaldoCategoriaPorBanco } from "../../types/Categoria";

type ES = {
  Banco: string,
  Categoria: string,
  "Data de competência": string,
  "Descrição": string,
  Valor: string
}

type TR = {
  "Tipo de transferência": string,
  Descrição: string,
  Valor: string,
  Origem: string,
  Destino: string,
  Intermediario: string,
  "Data de competência": string
}

function checkSpreadSheetFileModel(workbook: WorkBook): boolean {
  
  if (!(workbook.SheetNames.includes(SheetNames[0]) && workbook.SheetNames.includes(SheetNames[1]))) {
    toast.error("O modelo da planilha está incorreto. Verifique o modelo e tente novamente.");
    return false;
  };


  const esSheetHeaders = utils.sheet_to_json(workbook.Sheets[SheetNames[0]], { header: 1 })[0] as Array<string>;
  for (let i = 0; i < EntradasSaidasColumns.length; i++) {
    if (esSheetHeaders[i] !== EntradasSaidasColumns[i]) {
      toast.error("O modelo da planilha está incorreto. Verifique o modelo e tente novamente.");
      return false;
    }
  }

  const trSheetHeaders = utils.sheet_to_json(workbook.Sheets[SheetNames[1]], { header: 1 })[0] as Array<string>;
  for (let i = 0; i < TransferenciasColumns.length; i++) {
    if (trSheetHeaders[i] !== TransferenciasColumns[i]) {
      toast.error("O modelo da planilha está incorreto. Verifique o modelo e tente novamente.");
      return false;
    }
  }

  const esSheet = utils.sheet_to_json(workbook.Sheets[SheetNames[0]]) as ES[];
  const trSheet = utils.sheet_to_json(workbook.Sheets[SheetNames[1]]) as TR[];

  for (let i = 0; i < esSheet.length; i++) {
    if (esSheet[i]['Valor'] && isNaN(Number(esSheet[i]['Valor']))) {
      toast.error("O modelo da planilha está incorreto. Verifique o modelo e tente novamente.");
      return false;
    }

    if (esSheet[i]["Data de competência"] && isNaN(Date.parse(esSheet[i]["Data de competência"]))) {
      toast.error("O modelo da planilha está incorreto. Verifique o modelo e tente novamente.");
      return false;
    }

  }

  for (let i = 0; i < trSheet.length; i++) {
    if (trSheet[i]['Valor'] && isNaN(Number(trSheet[i]['Valor']))) {
      toast.error("O modelo da planilha está incorreto. Verifique o modelo e tente novamente.");
      return false;
    }

    if (trSheet[i]['Tipo de transferência'] && !(trSheet[i]['Tipo de transferência'] === 'Entrada' || trSheet[i]['Tipo de transferência'] === 'Saída')) {
      toast.error("O modelo da planilha está incorreto. Verifique o modelo e tente novamente.");
      return false;
    }

    if (trSheet[i]['Origem'] && trSheet[i]['Destino'] && trSheet[i]['Origem'] === trSheet[i]['Destino']) {
      toast.error("O modelo da planilha está incorreto. Verifique o modelo e tente novamente.");
      return false;
    }

    if (trSheet[i]["Data de competência"] && isNaN(Date.parse(trSheet[i]["Data de competência"]))) {
      toast.error("O modelo da planilha está incorreto. Verifique o modelo e tente novamente.");
      return false;
    }
  }

  toast.success("Modelo de planilha verificado com sucesso!");

  return true
} 

class GetCategoriasDataFuncions {

  static async getSaldosCategoriasPorBanco(id_categoria: number): Promise<SaldoCategoriaPorBanco[]>{
    const response = await axios.get("saldos-por-categoria/categoria/" + id_categoria);
    
    return response.data;
  }
  

  static async getCategorias(id_user: Number): Promise<Categoria[]>{
    const response = await axios.get("/categorias/usuario/" + id_user);
    
    return response.data;
  }
}

class GetBancosDataFuncions {

  static async getSaldosBancosPorCategoria(id_banco: number): Promise<SaldoBancoPorCategoria[]>{
    const response = await axios.get("/saldos-por-categoria/banco/" + id_banco);
    
    return response.data;
  }
  

  static async getBancos(id_user: number): Promise<Banco[]>{
    const response = await axios.get(`/bancos/usuario/${id_user}`);
    
    return response.data;
  }
}

export default function EnviaPorPlanilha() {
  const { user } = useAuth();  
  const [fileUploaded, setFileUploaded] = React.useState<boolean>(false);
  const [entradasSaidasData, setEntradasSaidasData] = React.useState<any[]>([]);
  const [transferenciasData, setTransferenciasData] = React.useState<any[]>([]);
  const [optionSelectedId, setOptionSelectedId] = React.useState<number>(1);

  const [bancosNames, setBancos]: [string[], any] = React.useState([]);
  const [categoriasNames, setCategorias]: [string[], any] = React.useState([]);
  const [idBancos, setIdBancos] = React.useState<{[key: string]: number}>({});
  const [idCategorias, setIdCategorias] = React.useState<{[key: string]: number}>({});
  
  React.useEffect(() => {
      GetBancosDataFuncions.getBancos(user!.id).then((data: Banco[]) => {
        setBancos(data.map(banco => banco.nome));
        setIdBancos(Object.assign({}, ...data.map(banco => ({[banco.nome]: banco.id}))));
      });
    }, [user]);

  React.useEffect(() => {
      GetCategoriasDataFuncions.getCategorias(user!.id).then((data: Categoria[]) => {
        setCategorias(data.map(categoria => categoria.nome));
        setIdCategorias(Object.assign({}, ...data.map(categoria => ({[categoria.nome]: categoria.id}))));
      });
    }, [user])

  function handleSelectFile(event: React.ChangeEvent<HTMLInputElement>) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement && inputElement.files && inputElement.files.length > 0) {
      document.querySelector<HTMLElement>('#file-name')!.innerText = inputElement.files[0].name;
    }
  }

  function handleUploadPlanilha() {
    const inputElement = document.querySelector('#dropzone-file') as HTMLInputElement;
    
    if (inputElement && inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      let fr = new FileReader();

      fr.onload = () => {
        const data = fr.result;
        if (data) {
          const workbook = read(data, { type: 'binary' });
          loadPlanilha(workbook);
        }
      }

      fr.readAsArrayBuffer(file);

    }
  }

  function loadPlanilha (WorkBook: WorkBook) {
    if (checkSpreadSheetFileModel(WorkBook)) {
            // Parse Entradas-Saidas sheet
            const esSheet = utils.sheet_to_json(WorkBook.Sheets[SheetNames[0]], { header: 1 }) as Array<Array<any>>;
            let esData = esSheet.slice(1).map((row, index) => ({
              id: index,
              banco: row[0] || '',
              categoria: row[1] || '',
              descricao: row[2] || '',
              valor: row[3] || 0,
              dataCompetencia: row[4] ? new Date(new Date(getJsDateFromExcel(row[4])).setDate(new Date(getJsDateFromExcel(row[4])).getDate() + 1)).toLocaleDateString("pt-br").split("/").reverse().join("-") : ''
            })).filter(row => row.banco || row.categoria || row.descricao);
            
            // Parse Transferencias sheet
            const trSheet = utils.sheet_to_json(WorkBook.Sheets[SheetNames[1]], { header: 1 }) as Array<Array<any>>;
            let trData = trSheet.slice(1).map((row, index) => ({
              id: index,
              tipoTransferencia: row[0] || '',
              descricao: row[1] || '',
              valor: row[2] || 0,
              origem: row[3] || '',
              destino: row[4] || '',
              intermediario: row[5] || '',
              dataCompetencia: row[6] ? new Date(new Date(getJsDateFromExcel(row[6])).setDate(new Date(getJsDateFromExcel(row[6])).getDate() + 1)).toLocaleDateString("pt-br").split("/").reverse().join("-") : ''
            })).filter(row => (row.tipoTransferencia && row.descricao && row.origem && row.destino && row.intermediario));

            trData.forEach((tr) => {
              if (tr.tipoTransferencia === 'Entre Bancos') {
                if (!categoriasNames.includes(tr.intermediario)) {
                  toast.error(`Categoria inválida na transferência: ${tr.descricao}`);
                }
                if (!bancosNames.includes(tr.destino) || !bancosNames.includes(tr.origem)) {
                  toast.error(`Banco de origem ou destino inválido na transferência: ${tr.descricao}`);
                }
              } else if (tr.tipoTransferencia === 'Entre Categorias') {
                if (!bancosNames.includes(tr.intermediario)) {
                  toast.error(`Banco inválido na transferência: ${tr.descricao}`);
                }
                if (!categoriasNames.includes(tr.destino) || !categoriasNames.includes(tr.origem)) {
                  toast.error(`Categoria de origem ou destino inválida na transferência: ${tr.descricao}`);
                }
              }
              
            })

            esData.forEach((es) => {
              if (!bancosNames.includes(es.banco)) {
                toast.error(`Banco inválido na entrada/saída: ${es.descricao}`);
              }
              if (!categoriasNames.includes(es.categoria)) {
                toast.error(`Categoria inválida na entrada/saída: ${es.descricao}`);
              }
            })

            trData = trData.filter((tr) => {
              if (tr.tipoTransferencia === 'Entre Bancos') {
                return (bancosNames.includes(tr.origem) && bancosNames.includes(tr.destino) && categoriasNames.includes(tr.intermediario))
              } else if (tr.tipoTransferencia === 'Entre Categorias') {
                return (categoriasNames.includes(tr.origem) && categoriasNames.includes(tr.destino) && bancosNames.includes(tr.intermediario))
              }
            })
            esData = esData.filter((es) => {
            return (bancosNames.includes(es.banco) && categoriasNames.includes(es.categoria))
            })

            setEntradasSaidasData(esData);
            setTransferenciasData(trData);
            setFileUploaded(true);
          }

  }

  async function saveTransferencias () {
    const transferenciasPayload: any[] = [];

    for (let i = 0; i < transferenciasData.length; i++) {
      if (transferenciasData[i]['tipoTransferencia'] === 'Entre Bancos') {
        if (
        !Object.hasOwn(idBancos, transferenciasData[i].origem) || 
        !Object.hasOwn(idBancos, transferenciasData[i].destino) || 
        !Object.hasOwn(idCategorias, transferenciasData[i].intermediario)) {
          toast.error(`Erro ao enviar transferência: ${transferenciasData[i].descricao}. Verifique os dados e tente novamente.`);
          return;
        }

        transferenciasPayload.push({
          tipo: "entre_bancos",
          id_usuario: user!.id,
          id_banco_origem: idBancos[transferenciasData[i].origem],
          id_banco_destino: idBancos[transferenciasData[i].destino],
          id_categoria: idCategorias[transferenciasData[i].intermediario],
          descricao: transferenciasData[i].descricao,
          valor: transferenciasData[i].valor,
          data_de_competencia: transferenciasData[i].dataCompetencia,
        })

      } else if (transferenciasData[i]['tipoTransferencia'] === 'Entre Categorias') {
        if (
        !Object.hasOwn(idCategorias, transferenciasData[i].origem) || 
        !Object.hasOwn(idCategorias, transferenciasData[i].destino) || 
        !Object.hasOwn(idBancos, transferenciasData[i].intermediario)) {
          toast.error(`Erro ao enviar transferência: ${transferenciasData[i].descricao}. Verifique os dados e tente novamente.`);
          return;
        }

        transferenciasPayload.push({
          tipo: "entre_categorias",
          id_usuario: user!.id,
          id_categoria_origem: idCategorias[transferenciasData[i].origem],
          id_categoria_destino: idCategorias[transferenciasData[i].destino],
          id_banco: idBancos[transferenciasData[i].intermediario],
          descricao: transferenciasData[i].descricao,
          valor: transferenciasData[i].valor,
          data_de_competencia: transferenciasData[i].dataCompetencia,
        })

      }
    }
    try {
        const res = await axios.post("/transferencias/novo/lista", transferenciasPayload);
        if (res.status === 201 || res.status === 200) {
          toast.success("Transferência entre bancos enviada");
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.detail || "Erro ao enviar transferência");
      }
  }

  async function saveEntradasSaidas () {
    const depositosPayload: any[] = [];
    const gastosPayload: any[] = [];

    if (entradasSaidasData.length === 0) {
      toast.warning("Nenhum dado de entradas e saídas para salvar.");
      return;
    }

    for (let i = 0; i < entradasSaidasData.length; i++) {
      if (
        !Object.hasOwn(idBancos, entradasSaidasData[i].banco) || 
        !Object.hasOwn(idCategorias, entradasSaidasData[i].categoria)) {
          toast.error(`Erro ao enviar entrada/saída: ${entradasSaidasData[i].descricao}. Verifique os dados e tente novamente.`);
          return;
        }
      if (entradasSaidasData[i].valor >= 0) {
        depositosPayload.push({
          id_usuario: user!.id,
          id_banco: idBancos[entradasSaidasData[i].banco],
          id_categoria: idCategorias[entradasSaidasData[i].categoria],
          descricao: entradasSaidasData[i].descricao,
          valor: entradasSaidasData[i].valor,
          data_de_competencia: entradasSaidasData[i].dataCompetencia,
        })
      } else if (entradasSaidasData[i].valor < 0) {
        gastosPayload.push({
          id_usuario: user!.id,
          id_banco: idBancos[entradasSaidasData[i].banco],
          id_categoria: idCategorias[entradasSaidasData[i].categoria],
          descricao: entradasSaidasData[i].descricao,
          valor: Math.abs(entradasSaidasData[i].valor),
          data_de_competencia: entradasSaidasData[i].dataCompetencia,
        })
      }

    }

    try {
      if (depositosPayload.length > 0) {
        const resDepositos = await axios.post("/depositos/novo/lista", depositosPayload);
        if (resDepositos.status === 201 || resDepositos.status === 200) {
          toast.success("Depósitos enviados com sucesso!");
        }
      }
      if (gastosPayload.length > 0) {
        const resGastos = await axios.post("/gastos/novo/lista", gastosPayload);
        if (resGastos.status === 201 || resGastos.status === 200) {
          toast.success("Gastos enviados com sucesso!");
        }
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Erro ao enviar entradas/saídas");
    }
    
  }

  function handleSaveData () {
    saveEntradasSaidas().then(() => {
      saveTransferencias().then(() => {});  
    });
              
  }

  return (
    <GeneralBox>
      <Title>Envia dados financeiros por planilha</Title>
      <div style={{
        display: "flex",
        flexDirection: "row",
        margin: "1rem auto",
      }}>
        <InputBox fileUploaded={fileUploaded}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: fileUploaded ? "2rem" : "100%",
            alignItems: "center",
            justifyContent: "center", 
          }}>
            <DzLabel
              htmlFor="dropzone-file"
            >
              {
                fileUploaded ? null : (<DzImageDiv>
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
                  color: "white",
                }}>XLSX</p>
              </DzImageDiv>
              )
              }
              
              <FileInput id="dropzone-file" style={{visibility: "hidden"}} onChange={handleSelectFile}/>
              <FileNameSpan id="file-name" ></FileNameSpan>
            </DzLabel>
          </div>

          <Button style={{marginTop: '1rem'}} onClick={handleUploadPlanilha}>
            <span>Enviar Planilha</span>
          </Button>
          {
            fileUploaded ? null : (
              <a href="https://drive.google.com/uc?export=download&id=17-ja9_i4gODMC_gnGcYsDRwgmfbY3n6o">
                <Button>
                  <span>Baixar modelo XLSX</span>
                </Button>
              </a>
            )
          }
          
          
        </InputBox>
      </div>


      {fileUploaded && (
        <>
          <StyledButtonGroup className="transferencias-button-group">
            <StyledButton id={1} selected={optionSelectedId === 1} onClick={() => setOptionSelectedId(1)}>Entradas e Saídas</StyledButton>
            <StyledButton id={2} selected={optionSelectedId === 2} onClick={() => setOptionSelectedId(2)}>Transferências</StyledButton>
          </StyledButtonGroup>
          {optionSelectedId === 1 ? (
            <div style={{ margin: "0 1rem" }}>
              <SubTitle2>Entradas e Saídas</SubTitle2>
              <div style={{ height: 300, width: "100%", marginTop: "1rem" }}>
                <DataGrid
                  rows={entradasSaidasData}
                  columns={[
                    { field: 'banco', headerName: 'Banco', width: 150, editable: true },
                    { field: 'categoria', headerName: 'Categoria', width: 150, editable: true,  },
                    { field: 'descricao', headerName: 'Descrição', width: 250, editable: true },
                    { field: 'valor', headerName: 'Valor', width: 130, editable: true, type: 'number', valueFormatter: (value: number) => `R$ ${value.toFixed(2)}` },
                    { field: 'dataCompetencia', headerName: 'Data de Competência', width: 180, editable: true },
                  ]}
                  slotProps={{
                    cell: {

                      on: (e:any) => {
                        console.log(e)
                      }
                    }
                  }}
                  processRowUpdate={(newRow) => {
                    const updatedData = entradasSaidasData.map((row) =>
                      row.id === newRow.id ? newRow : row
                    );
                    setEntradasSaidasData(updatedData);
                    return newRow;
                  }}
                  sx={{
                    '& .MuiDataGrid-columnHeaders': {
                      backgroundColor: colors.primaryColor,
                      color: colors.secondaryColor,
                      fontWeight: 'bold',
                    },
                  }}
                />
              </div>
              <InputBox style={{alignItems: "top", justifyContent: "flex-start", marginTop: "1rem"}}>
                <Button style={{marginTop: '0.1rem', width: '10rem', height: "5rem"}} onClick={handleSaveData}>
                  <span>Salvar Dados</span>
                </Button>
              </InputBox>
            </div>
          ): (
            <div style={{ margin: "2rem 1rem" }}>
              <SubTitle2>Transferências</SubTitle2>
              <div style={{ height: 300, width: "100%", marginTop: "1rem" }}>
                <DataGrid
                  rows={transferenciasData}
                  columns={[
                    { field: 'tipoTransferencia', headerName: 'Tipo', width: 150, editable: true },
                    { field: 'descricao', headerName: 'Descrição', width: 200, editable: true },
                    { field: 'valor', headerName: 'Valor', width: 130, editable: true, type: 'number', valueFormatter: (value: number) => `R$ ${value.toFixed(2)}` },
                    { field: 'origem', headerName: 'Origem', width: 150, editable: true },
                    { field: 'destino', headerName: 'Destino', width: 150, editable: true },
                    { field: 'intermediario', headerName: 'Intermediario', width: 150, editable: true },
                    { field: 'dataCompetencia', headerName: 'Data de Competência', width: 180, editable: true },
                  ]}
                  processRowUpdate={(newRow) => {
                    const updatedData = transferenciasData.map((row) =>
                      row.id === newRow.id ? newRow : row
                    );
                    setTransferenciasData(updatedData);
                    return newRow;
                  }}
                  sx={{
                    '& .MuiDataGrid-columnHeaders': {
                      backgroundColor: colors.primaryColor,
                      color: colors.secondaryColor,
                      fontWeight: 'bold',
                    },
                  }}
                />
              </div>
              <InputBox style={{alignItems: "top", justifyContent: "flex-start", marginTop: "1rem"}}>
                <Button style={{marginTop: '0.1rem', width: '10rem', height: "5rem"}} onClick={handleSaveData}>
                  <span>Salvar Dados</span>
                </Button>
              </InputBox>
            </div>
          )}

          
        </>
      )}
      
      
    </GeneralBox>
  );
}