package alphabravo.springsecurity.InitValues;

import alphabravo.springsecurity.model.Person;
import alphabravo.springsecurity.model.Role;
import alphabravo.springsecurity.repositories.PersonRepo;
import alphabravo.springsecurity.repositories.RoleRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.Set;

@Component
public class DataInitValues {

    private final RoleRepo roleRepo;

    private final PersonRepo personRepo;

    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataInitValues(RoleRepo roleRepo, PersonRepo personRepo, PasswordEncoder passwordEncoder) {
        this.roleRepo = roleRepo;
        this.personRepo = personRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void init() {
        Role user = roleRepo.findRoleByRole("ROLE_USER");
        if (user == null) user = new Role("ROLE_USER");
        roleRepo.save(user);

        Role admin = roleRepo.findRoleByRole("ROLE_ADMIN");
        if (admin == null) admin = new Role("ROLE_ADMIN");
        roleRepo.save(admin);

        Person Pasha = personRepo.findPersonByUsername("Pasha");
        if (Pasha == null) Pasha = new Person("Pasha", "apple", "Pavel",
                "Kononov", 28, "lovecars527@gmail.com", Set.of(user, admin));
        Pasha.setPassword(passwordEncoder.encode(Pasha.getPassword()));
        personRepo.save(Pasha);

        Person Dima = personRepo.findPersonByUsername("Dima");
        if (Dima == null) Dima = new Person("Dima", "green", "Dima",
                "Pomazkov", 29, "lovecars527@gmail.com", Set.of(user, admin));
        Dima.setPassword(passwordEncoder.encode(Dima.getPassword()));
        personRepo.save(Dima);

        Person Nikita = personRepo.findPersonByUsername("Nikita");
        if (Nikita == null) Nikita = new Person("Nikita67", "purple", "Nikita",
                "Promyschlennikov", 26, "Promyh67527@gmail.com", Set.of(user, admin));
        Nikita.setPassword(passwordEncoder.encode(Nikita.getPassword()));
        personRepo.save(Nikita);

        Person hr = personRepo.findPersonByUsername("hr");
        if (hr == null) hr = new Person("hr", "work", "John", "Peterson", 43,
                "Peterson6@gmail.com", Set.of(user));
        hr.setPassword(passwordEncoder.encode(hr.getPassword()));
        personRepo.save(hr);

        Person employer = personRepo.findPersonByUsername("employer");
        if (employer == null) employer = new Person("employer", "hardwork", "Andrew", "Sneider",
                57, "Andr456@gmail.com", Set.of(user));
        employer.setPassword(passwordEncoder.encode(employer.getPassword()));
        personRepo.save(employer);
    }
}
