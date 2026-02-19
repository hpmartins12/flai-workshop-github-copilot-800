from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout


class UserModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            name='Test User',
            email='test@example.com',
            password='password123',
        )

    def test_user_str(self):
        self.assertEqual(str(self.user), 'Test User')

    def test_user_email_unique(self):
        self.assertEqual(self.user.email, 'test@example.com')


class TeamModelTest(TestCase):
    def setUp(self):
        self.team = Team.objects.create(
            name='Team Alpha',
            description='A test team',
        )

    def test_team_str(self):
        self.assertEqual(str(self.team), 'Team Alpha')


class ActivityModelTest(TestCase):
    def setUp(self):
        self.activity = Activity.objects.create(
            user_id='1',
            activity_type='Running',
            duration=30,
            calories=300,
        )

    def test_activity_str(self):
        self.assertIn('Running', str(self.activity))


class LeaderboardModelTest(TestCase):
    def setUp(self):
        self.entry = Leaderboard.objects.create(
            team_id='1',
            total_calories=1500,
            total_activities=10,
            rank=1,
        )

    def test_leaderboard_str(self):
        self.assertIn('Rank 1', str(self.entry))


class WorkoutModelTest(TestCase):
    def setUp(self):
        self.workout = Workout.objects.create(
            name='Morning Run',
            description='A 5km morning run',
            difficulty='beginner',
            duration=30,
            calories_estimate=300,
            category='cardio',
        )

    def test_workout_str(self):
        self.assertEqual(str(self.workout), 'Morning Run')


class UserAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create(
            name='API User',
            email='apiuser@example.com',
            password='pass123',
        )

    def test_get_users(self):
        url = reverse('user-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_user(self):
        url = reverse('user-list')
        data = {'name': 'New User', 'email': 'new@example.com', 'password': 'pass123'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class TeamAPITest(APITestCase):
    def setUp(self):
        self.team = Team.objects.create(name='Test Team', description='Desc')

    def test_get_teams(self):
        url = reverse('team-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class ActivityAPITest(APITestCase):
    def setUp(self):
        self.activity = Activity.objects.create(
            user_id='1', activity_type='Cycling', duration=45, calories=400
        )

    def test_get_activities(self):
        url = reverse('activity-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class LeaderboardAPITest(APITestCase):
    def setUp(self):
        self.entry = Leaderboard.objects.create(
            team_id='1', total_calories=2000, total_activities=15, rank=1
        )

    def test_get_leaderboard(self):
        url = reverse('leaderboard-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class WorkoutAPITest(APITestCase):
    def setUp(self):
        self.workout = Workout.objects.create(
            name='Yoga', description='Relaxing yoga session',
            difficulty='beginner', duration=60,
            calories_estimate=200, category='flexibility'
        )

    def test_get_workouts(self):
        url = reverse('workout-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class APIRootTest(APITestCase):
    def test_api_root(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
