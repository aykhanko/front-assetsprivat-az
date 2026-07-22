import type { Enterprise } from "../../types";
import styles from "./EnterprisesTable.module.css";

export interface EnterprisesTableProps {
  enterprises: Enterprise[];
}

/**
 * "Müəssisələr" siyahısını Excel görünüşünə yaxın cədvəl şəklində göstərir.
 *
 * QEYD: Bu mərhələdə linklər (mavi, altı xətli mətnlər) yalnız görünüş
 * məqsədi ilə əlavə olunub, funksional deyillər.
 */
export function EnterprisesTable({ enterprises }: EnterprisesTableProps) {
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
            <th scope="col">Müəssisənin mövcud vəziyyəti və problemləri</th>
            <th scope="col">Məkana get</th>
            <th scope="col">İnvestisiya öhdəlikləri və hazırki vəziyyət</th>
          </tr>
        </thead>
        <tbody>
          {enterprises.map((enterprise) => (
            <tr key={enterprise.id}>
              <td className={styles.serialCell}>{enterprise.serialNumber}</td>
              <td>
                <span className={styles.link}>{enterprise.name}</span>
              </td>
              <td>{enterprise.location}</td>
              <td>{enterprise.address}</td>
              <td>{enterprise.taxId}</td>
              <td>{enterprise.previousParentCompany}</td>
              <td>{enterprise.charterCapital}</td>
              <td>{enterprise.landArea}</td>
              <td>{enterprise.buildingArea}</td>
              <td>{enterprise.privatizationDate}</td>
              <td>
                <span className={styles.link}>{enterprise.investorInfo}</span>
              </td>
              <td>
                <span className={styles.link}>
                  {enterprise.currentStatusAndIssues}
                </span>
              </td>
              <td>
                <span className={styles.link}>Google xəritəyə get</span>
              </td>
              <td>
                <span className={styles.link}>
                  {enterprise.investmentCommitmentsAndStatus}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
