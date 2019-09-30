from faker import Faker
fake = Faker()


def generate_fake_data(amount):
    # https://faker.readthedocs.io/en/master/providers.html
    data = []
    for _ in range(amount):
        data.append(fake.name())