package alphabravo.springsecurity.service;

import alphabravo.springsecurity.model.Person;
import alphabravo.springsecurity.repositories.PersonRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PersonDetailsService implements UserDetailsService, PersonDetails {
    private final PersonRepo personRepo;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public PersonDetailsService(PersonRepo personRepo, @Lazy PasswordEncoder passwordEncoder) {
        this.personRepo = personRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Person person = personRepo.findPersonByUsername(username);
        if (person == null) throw new UsernameNotFoundException("Incorrect Person");
        return person;
    }

    @Override
    @Transactional
    public void savePerson(Person person) {
        person.setPassword(passwordEncoder.encode(person.getPassword()));
        personRepo.save(person);
    }

    @Override
    @Transactional
    public void toUpdatePerson(long id, Person personFromClient) throws Exception {
        Person personFromDataBase = personRepo.findById(id).
                orElseThrow(() -> new Exception("Пользователь не найден"));

        if (personFromClient.getPassword().equals(personFromDataBase.getPassword())) {
            personRepo.save(personFromClient);
        } else {
            personFromClient.setPassword(passwordEncoder.encode(personFromClient.getPassword()));
            personRepo.save(personFromClient);
        }
    }

    @Override
    @Transactional
    public void remove(long id) {
        personRepo.deleteById(id);
    }

    @Override
    public Person getPersonById(long id) {
        return personRepo.findById(id).orElse(new Person());
    }

    @Override
    public List<Person> getPeople() {
        return personRepo.findAll();
    }
}
