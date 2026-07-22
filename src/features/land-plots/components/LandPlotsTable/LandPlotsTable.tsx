import type { LandPlot } from "../../types";
import styles from "./LandPlotsTable.module.css";

export interface LandPlotsTableProps {
  landPlots: LandPlot[];
}

/**
 * "Torpaq sahələri" siyahısını Excel görünüşünə yaxın cədvəl şəklində
 * göstərir.
 *
 * QEYD: Bu mərhələdə linklər (mavi, altı xətli mətnlər) yalnız görünüş
 * məqsədi ilə əlavə olunub, funksional deyillər.
 */
export function LandPlotsTable({ landPlots }: LandPlotsTableProps) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">S/S</th>
            <th scope="col">Obyektin adı</th>
            <th scope="col">Ünvanı</th>
            <th scope="col">İcarə müqaviləsinin nömrəsi və tarixi</th>
            <th scope="col">Mülkiyyətçi haqqında məlumat</th>
            <th scope="col">
              Mülkiyyət hüququnu təsdiq edilməsinə dair sənədin nömrəsi və
              tarixi
            </th>
            <th scope="col">Sənəd üzrə torpaq sahəsi (ha)</th>
            <th scope="col">Torpağın faktiki sahəsi (ha)</th>
            <th scope="col">Torpaq sahəsinin 1 sotunun qiyməti (manat)</th>
            <th scope="col">Torpaq sahəsinin ümumi qiyməti (manat)</th>
            <th scope="col">Dövlət və ya qeyri-dövlət</th>
            <th scope="col">Obyektin ilkin özəlləşmə anındakı adı</th>
            <th scope="col">
              Fəaliyyət növü (sağlıq evi, restoran, çayxana və s.)
            </th>
            <th scope="col">Zona</th>
            <th scope="col">Kateqoriya</th>
            <th scope="col">Mühafizə zonası</th>
            <th scope="col">Obyektin təsviri</th>
            <th scope="col">Cari statusu</th>
            <th scope="col">
              Qeyd (zəbt, sökülüb, park ərazisi, binanın bir hissəsi)
            </th>
          </tr>
        </thead>
        <tbody>
          {landPlots.map((landPlot) => (
            <tr key={landPlot.id}>
              <td className={styles.serialCell}>{landPlot.serialNumber}</td>
              <td>
                <span className={styles.link}>{landPlot.objectName}</span>
              </td>
              <td>
                <span className={styles.link}>{landPlot.address}</span>
              </td>
              <td>{landPlot.leaseAgreementNumberAndDate}</td>
              <td>{landPlot.ownerInfo}</td>
              <td>{landPlot.ownershipDocumentNumberAndDate}</td>
              <td>{landPlot.documentedLandArea}</td>
              <td>{landPlot.actualLandArea}</td>
              <td>{landPlot.pricePerSotka}</td>
              <td>{landPlot.totalLandPrice}</td>
              <td>{landPlot.ownershipType}</td>
              <td>{landPlot.initialPrivatizationName}</td>
              <td>{landPlot.activityType}</td>
              <td>{landPlot.zone}</td>
              <td>{landPlot.category}</td>
              <td>{landPlot.protectionZone}</td>
              <td>{landPlot.objectDescription}</td>
              <td>{landPlot.currentStatus}</td>
              <td>{landPlot.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
