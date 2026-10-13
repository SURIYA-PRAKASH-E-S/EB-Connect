import csv

from django.core.management.base import BaseCommand
from accounts.models import Customer


class Command(BaseCommand):
    help = "Import customers from CSV file"

    def add_arguments(self, parser):
        parser.add_argument("csv_file", type=str)

    def handle(self, *args, **options):

        csv_file = options["csv_file"]

        try:
            with open(csv_file, "r", encoding="utf-8") as file:

                reader = csv.DictReader(file)

                count = 0

                for row in reader:

                    Customer.objects.update_or_create(
                        email=row["email"],
                        defaults={
                            "name": row["name"],
                            "phone": row["phone"],
                            "address": row["address"],
                            "city": row["city"],
                            "state": row["state"],
                            "pincode": row["pincode"],
                        }
                    )

                    count += 1

            self.stdout.write(
                self.style.SUCCESS(
                    f"Successfully imported {count} customers."
                )
            )

        except FileNotFoundError:
            self.stdout.write(
                self.style.ERROR(
                    f"File not found: {csv_file}"
                )
            )