from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout
from datetime import datetime, timedelta
import random


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        self.stdout.write('Clearing existing data...')
        
        # Delete all existing data
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()
        
        self.stdout.write(self.style.SUCCESS('Existing data cleared'))
        
        # Create teams
        self.stdout.write('Creating teams...')
        team_marvel = Team.objects.create(
            name='Team Marvel',
            description='Earth\'s Mightiest Heroes'
        )
        team_dc = Team.objects.create(
            name='Team DC',
            description='Justice League United'
        )
        self.stdout.write(self.style.SUCCESS(f'Created teams: {team_marvel.name}, {team_dc.name}'))
        
        # Create Marvel users
        self.stdout.write('Creating Marvel heroes...')
        marvel_users = [
            User.objects.create(
                name='Iron Man',
                email='tony.stark@marvel.com',
                password='arc_reactor_3000',
                team_id=str(team_marvel.id)
            ),
            User.objects.create(
                name='Captain America',
                email='steve.rogers@marvel.com',
                password='super_soldier_serum',
                team_id=str(team_marvel.id)
            ),
            User.objects.create(
                name='Thor',
                email='thor.odinson@marvel.com',
                password='mjolnir_worthy',
                team_id=str(team_marvel.id)
            ),
            User.objects.create(
                name='Black Widow',
                email='natasha.romanoff@marvel.com',
                password='red_room_graduate',
                team_id=str(team_marvel.id)
            ),
            User.objects.create(
                name='Hulk',
                email='bruce.banner@marvel.com',
                password='gamma_radiation',
                team_id=str(team_marvel.id)
            ),
        ]
        
        # Create DC users
        self.stdout.write('Creating DC heroes...')
        dc_users = [
            User.objects.create(
                name='Superman',
                email='clark.kent@dc.com',
                password='kryptonite_free',
                team_id=str(team_dc.id)
            ),
            User.objects.create(
                name='Batman',
                email='bruce.wayne@dc.com',
                password='dark_knight_rises',
                team_id=str(team_dc.id)
            ),
            User.objects.create(
                name='Wonder Woman',
                email='diana.prince@dc.com',
                password='lasso_of_truth',
                team_id=str(team_dc.id)
            ),
            User.objects.create(
                name='Flash',
                email='barry.allen@dc.com',
                password='speed_force',
                team_id=str(team_dc.id)
            ),
            User.objects.create(
                name='Aquaman',
                email='arthur.curry@dc.com',
                password='king_of_atlantis',
                team_id=str(team_dc.id)
            ),
        ]
        
        all_users = marvel_users + dc_users
        self.stdout.write(self.style.SUCCESS(f'Created {len(all_users)} users'))
        
        # Create activities for users
        self.stdout.write('Creating activities...')
        activity_types = ['Running', 'Swimming', 'Cycling', 'Weight Training', 'Yoga', 'Boxing', 'HIIT']
        activity_count = 0
        
        for user in all_users:
            # Create 3-7 random activities per user
            num_activities = random.randint(3, 7)
            for i in range(num_activities):
                activity_type = random.choice(activity_types)
                duration = random.randint(20, 120)
                calories = duration * random.randint(5, 12)
                distance = round(random.uniform(2, 15), 2) if activity_type in ['Running', 'Swimming', 'Cycling'] else None
                
                Activity.objects.create(
                    user_id=str(user.id),
                    activity_type=activity_type,
                    duration=duration,
                    calories=calories,
                    distance=distance,
                    notes=f'{user.name} completed {activity_type}',
                    created_at=datetime.now() - timedelta(days=random.randint(0, 30))
                )
                activity_count += 1
        
        self.stdout.write(self.style.SUCCESS(f'Created {activity_count} activities'))
        
        # Calculate and create leaderboard entries
        self.stdout.write('Creating leaderboard entries...')
        
        # Calculate Marvel team stats
        marvel_activities = Activity.objects.filter(user_id__in=[str(u.id) for u in marvel_users])
        marvel_total_calories = sum(a.calories for a in marvel_activities)
        marvel_total_activities = marvel_activities.count()
        
        # Calculate DC team stats
        dc_activities = Activity.objects.filter(user_id__in=[str(u.id) for u in dc_users])
        dc_total_calories = sum(a.calories for a in dc_activities)
        dc_total_activities = dc_activities.count()
        
        # Determine ranks
        if marvel_total_calories > dc_total_calories:
            marvel_rank, dc_rank = 1, 2
        else:
            marvel_rank, dc_rank = 2, 1
        
        Leaderboard.objects.create(
            team_id=str(team_marvel.id),
            total_calories=marvel_total_calories,
            total_activities=marvel_total_activities,
            rank=marvel_rank
        )
        
        Leaderboard.objects.create(
            team_id=str(team_dc.id),
            total_calories=dc_total_calories,
            total_activities=dc_total_activities,
            rank=dc_rank
        )
        
        self.stdout.write(self.style.SUCCESS('Created leaderboard entries'))
        
        # Create workout suggestions
        self.stdout.write('Creating workout suggestions...')
        workouts = [
            Workout.objects.create(
                name='Super Soldier Circuit',
                description='A high-intensity circuit training inspired by Captain America\'s training regimen',
                difficulty='advanced',
                duration=45,
                calories_estimate=500,
                category='strength'
            ),
            Workout.objects.create(
                name='Speed Force Sprints',
                description='Lightning-fast interval sprints to build speed and endurance',
                difficulty='intermediate',
                duration=30,
                calories_estimate=400,
                category='cardio'
            ),
            Workout.objects.create(
                name='Amazonian Warrior Yoga',
                description='Flexibility and strength training inspired by Wonder Woman',
                difficulty='beginner',
                duration=40,
                calories_estimate=250,
                category='flexibility'
            ),
            Workout.objects.create(
                name='Dark Knight Boxing',
                description='Advanced boxing and martial arts workout for ultimate fitness',
                difficulty='advanced',
                duration=60,
                calories_estimate=650,
                category='cardio'
            ),
            Workout.objects.create(
                name='Atlantean Swimming',
                description='Full-body swimming workout for strength and endurance',
                difficulty='intermediate',
                duration=45,
                calories_estimate=450,
                category='cardio'
            ),
            Workout.objects.create(
                name='Asgardian Hammer Swing',
                description='Functional strength training with weights and power movements',
                difficulty='advanced',
                duration=50,
                calories_estimate=550,
                category='strength'
            ),
            Workout.objects.create(
                name='Arc Reactor Core',
                description='Core strengthening exercises for stability and power',
                difficulty='beginner',
                duration=25,
                calories_estimate=200,
                category='strength'
            ),
            Workout.objects.create(
                name='Gamma Smash HIIT',
                description='High-intensity interval training for maximum calorie burn',
                difficulty='intermediate',
                duration=35,
                calories_estimate=500,
                category='cardio'
            ),
        ]
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(workouts)} workout suggestions'))
        
        # Summary
        self.stdout.write(self.style.SUCCESS('\n=== Database Population Complete ==='))
        self.stdout.write(self.style.SUCCESS(f'Teams: {Team.objects.count()}'))
        self.stdout.write(self.style.SUCCESS(f'Users: {User.objects.count()}'))
        self.stdout.write(self.style.SUCCESS(f'Activities: {Activity.objects.count()}'))
        self.stdout.write(self.style.SUCCESS(f'Leaderboard Entries: {Leaderboard.objects.count()}'))
        self.stdout.write(self.style.SUCCESS(f'Workouts: {Workout.objects.count()}'))
