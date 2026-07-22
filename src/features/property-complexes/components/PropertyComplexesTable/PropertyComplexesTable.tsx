import type { PropertyComplex } from "../../types";
import styles from "./PropertyComplexesTable.module.css";

export interface PropertyComplexesTableProps {
  complexes: PropertyComplex[];
}

/**
 * "Əmlak kompleksləri" siyahısını Excel görünüşünə yaxın cədvəl şəklində
 * göstərir.
 *
 * QEYD: Bu mərhələdə linklər (mavi, altı xətli mətnlər) yalnız görünüş
 * məqsədi ilə əlavə olunub, funksional deyillər.
 */
export function PropertyComplexesTable({
  complexes,
}: PropertyComplexesTableProps) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">S.N</th>
            <th scope="col">Daşınmaz əmlakın adı</th>
            <th scope="col">Yerləşdiyi ərazi</th>
            <th scope="col">Ünvanı</th>
            <th scope="col">VÖEN</th>
            <th scope="col">Əvvəlki tabeçi müəssisə adı</th>
            <th scope="col">Nizamnamə kapitalı</th>
            <th scope="col">Torpaq sahəsi</th>
            <th scope="col">Tikililərin sahəsi</th>
            <th scope="col">Özəlləşdirilmə tarixi</th>
            <th scope="col">İnvestor haqqında məlumatlar</th>
            <th scope="col">Kompleksin mövcud vəziyyəti və problemləri</th>
            <th scope="col">Məkana get</th>
            <th scope="col">İnvestisiya öhdəlikləri və hazırki vəziyyət</th>
          </tr>
        </thead>
        <tbody>
          {complexes.map((complex) => (
            <tr key={complex.id}>
              <td className={styles.serialCell}>{complex.serialNumber}</td>
              <td>
                <span className={styles.link}>{complex.name}</span>
              </td>
              <td>{complex.location}</td>
              <td>{complex.address}</td>
              <td>{complex.taxId}</td>
              <td>{complex.previousParentCompany}</td>
              <td>{complex.charterCapital}</td>
              <td>{complex.landArea}</td>
              <td>{complex.buildingArea}</td>
              <td>{complex.privatizationDate}</td>
              <td>
                <span className={styles.link}>{complex.investorInfo}</span>
              </td>
              <td>
                <span className={styles.link}>
                  {complex.currentStatusAndIssues}
                </span>
              </td>
              <td>
                <span className={styles.link}>Google xəritəyə get</span>
              </td>
              <td>
                <span className={styles.link}>
                  {complex.investmentCommitmentsAndStatus}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
