import { NextFunction, Request, Response } from 'express';
import responseHandler from 'middlewares/handlers/responseHandler';

import { CreateCSVFile } from 'lib/utils/csv.utils';
import { NORMAL_REPORT_HEADERS } from 'lib/utils/report.utils';
import reportService from 'services/report.service';
import dayjs from 'dayjs';

const getNormalPolygonReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;
    const { data, error } = await reportService.getNormalPolygonReport(
      body?.startDate,
      body?.endDate,
      body?.chain || null,
      body?.userId || null,
    );

    if (error) {
      return responseHandler(res, error);
    }

    const formattedData = await reportService.prepareDataRowsForNormalPolygonReport(data);

    if (formattedData?.length === 0) {
      return next('No Data found to generate report');
    }

    const csv = await CreateCSVFile(NORMAL_REPORT_HEADERS, formattedData);

    res.header('Content-Type', 'text/csv');
    res.attachment(`Normal-Polygon-Report-${dayjs().format('YYYY-MM-DD_HH:mm:ss')}.csv`);
    return res.send(csv);
  } catch (error) {
    next(error);
  }
};

const getPolygonMarkingSummaryReport = async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;
  const startDate: string = body?.startDate || dayjs().subtract(3, 'month').format();
  const endDate: string = body?.endDate || dayjs().format();

  const { data, error } = await reportService.getPolygonMarkingSummaryReport(
    startDate,
    endDate,
    body?.chain || null,
    body?.userId || null,
  );
  if (error) return next(error);
  const formattedData = await reportService.prepareDataRowsForPolygonMarkingSummaryReport(
    data,
    startDate,
    endDate,
  );

  if (formattedData?.length === 0) {
    return next('No Data found to generate report');
  }

  const csv = await CreateCSVFile(NORMAL_REPORT_HEADERS, formattedData);

  res.header('Content-Type', 'text/csv');
  res.attachment(
    `Polygon-Marking-Summary-Report-Admin-${dayjs().format('YYYY-MM-DD_HH:mm:ss')}.csv`,
  );
  return res.send(csv);
};

const getPolygonMarkingDetailReport = async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;

  const { data, error } = await reportService.getPolygonMarkingDetailReport(
    body?.startDate,
    body?.endDate,
    body?.chain || null,
    body?.userId || null,
  );
  if (error) return next(error);
  const formattedData = await reportService.prepareDataRowsForPolygonMarkingDetailReport(data);

  if (formattedData?.length === 0) {
    return next('No Data found to generate report');
  }

  const csv = await CreateCSVFile(NORMAL_REPORT_HEADERS, formattedData);

  res.header('Content-Type', 'text/csv');
  res.attachment(
    `Polygon-Marking-Detail-Report-DataEntry-${dayjs().format('YYYY-MM-DD_HH:mm:ss')}.csv`,
  );
  return res.send(csv);
};

export = {
  getNormalPolygonReport,
  getPolygonMarkingSummaryReport,
  getPolygonMarkingDetailReport,
};
