import Table from '@mui/joy/Table';

import style from './TableActivity.module.css';


function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
) {
  return { name, calories, fat, carbs, protein };
}
const rows = [
  createData('1', 159, 6.0, 24, 4.0),
  createData('2', 237, 9.0, 37, 4.3),
  createData('3', 262, 16.0, 24, 6.0),
  createData('4', 305, 3.7, 67, 4.3),
  createData('5', 356, 16.0, 49, 3.9),
  createData('6', 159, 6.0, 24, 4.0),
  createData('7', 237, 9.0, 37, 4.3),
  createData('8', 262, 16.0, 24, 6.0),
  createData('9', 305, 3.7, 67, 4.3),
  createData('10', 356, 16.0, 49, 3.9),
];


export default function TableActivity() {
  return (
    <div className={style["table-container"]}>
      
      
        <Table
          aria-label="table with sticky header"
          stickyHeader
          stickyFooter
          // stripe="odd"
          // hoverRow
        >
          <thead>
            <tr>
              <th>Row</th>
              <th>Calories</th>
              <th>Fat&nbsp;(g)</th>
              
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name}>
                <td>{row.name}</td>
                <td>{row.calories}</td>
                <td>{row.fat}</td>
                
                
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr>
              <th scope="row" colSpan={4}><h2>Ver toda tu actividad</h2></th>
          
          
            </tr>
            
          </tfoot>
        </Table>
      
    </div>
  );
}
