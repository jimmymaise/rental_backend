-- CreateTable
CREATE TABLE "EmployeeOrgActivityLog" (
    "orgActivityLogId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,

    PRIMARY KEY ("orgActivityLogId")
);

-- AddForeignKey
ALTER TABLE "EmployeeOrgActivityLog" ADD FOREIGN KEY ("orgActivityLogId") REFERENCES "OrgActivityLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeOrgActivityLog" ADD FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
